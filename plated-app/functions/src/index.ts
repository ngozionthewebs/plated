import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

// Enable CORS
const corsHandler = cors({ origin: true });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

export interface AIRecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
}

export interface GenerateRecipeRequest {
  videoUrl: string;
}

/**
 * Cloud Function: Generate recipe from video URL
 */
export const generateRecipe = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
      }

      const { videoUrl } = req.body as GenerateRecipeRequest;

      if (!videoUrl) {
        res.status(400).json({ error: 'Video URL is required' });
        return;
      }

      console.log('Processing video URL:', videoUrl);

      // Use Gemini to analyze the video
      const recipe = await generateRecipeFromVideoUrl(videoUrl);

      console.log('Recipe generated successfully:', recipe.title);
      res.status(200).json(recipe);

    } catch (error) {
      console.error('Error in generateRecipe:', error);
      res.status(500).json({ 
        error: 'Failed to generate recipe: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    }
  });
});

/**
 * Generate recipe using Gemini's video analysis capabilities
 */
async function generateRecipeFromVideoUrl(videoUrl: string): Promise<AIRecipeResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert chef and recipe writer. 
Analyze this cooking video and convert it into a structured JSON recipe.

Video: ${videoUrl}

Extract from the video:
1. A catchy "title" for the recipe
2. A complete list of "ingredients" with quantities and measurements
3. Numbered, clear "instructions" in the correct order

IMPORTANT: Return ONLY valid JSON in this exact format. No additional text, no markdown, no code blocks.
{
  "title": "Recipe Name",
  "ingredients": ["1 cup flour", "2 eggs", "1 tsp salt"],
  "instructions": ["Step 1 description", "Step 2 description", "Step 3 description"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini raw response:', text);

    // Clean the response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

    // Parse the JSON response
    const recipe = JSON.parse(cleanText) as AIRecipeResponse;

    // Validate the response structure
    if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
      throw new Error('Invalid recipe structure from AI');
    }

    return recipe;
  } catch (error) {
    console.error('Error generating recipe with Gemini:', error);
    throw new Error(`AI recipe generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}