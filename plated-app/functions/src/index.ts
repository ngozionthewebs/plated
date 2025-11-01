import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors = require('cors');
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

// Enable CORS
const corsHandler = cors({ origin: true });

// Initialize Gemini AI
const geminiApiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
if (!geminiApiKey) {
  throw new Error('Gemini API key is required');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

export interface AIRecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

export interface GenerateRecipeRequest {
  videoUrl: string;
}

/**
 * ✅ EXISTING FUNCTION - KEEP THIS AS IS
 * Cloud Function: Generate recipe from video URL (HTTP version)
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
 * ✅ FIXED: Callable version (v6 compatible)
 */
export const generateRecipeFromVideo = functions.https.onCall(async (request) => {
  // Check authentication
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { videoUrl } = request.data;

  if (!videoUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'Video URL is required');
  }

  try {
    console.log('Processing video URL for user:', request.auth.uid);
    
    // Use the SAME recipe generation logic
    const recipe = await generateRecipeFromVideoUrl(videoUrl);
    
    console.log('Recipe generated successfully:', recipe.title);
    return recipe;

  } catch (error: any) {
    console.error('Error in generateRecipeFromVideo:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate recipe: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

/**
 * ✅ ENHANCED BUT COMPATIBLE: Improved recipe generation
 * This replaces your existing function but maintains compatibility
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
4. Optional: "prepTime", "cookTime", "servings", "difficulty", "tags"

IMPORTANT: Return ONLY valid JSON in this exact format. No additional text, no markdown, no code blocks.
{
  "title": "Recipe Name",
  "ingredients": ["1 cup flour", "2 eggs", "1 tsp salt"],
  "instructions": ["Step 1 description", "Step 2 description", "Step 3 description"],
  "prepTime": "15 mins",
  "cookTime": "30 mins",
  "servings": "4",
  "difficulty": "Easy",
  "tags": ["quick", "healthy", "dinner"]
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

    // Validate the required fields (title, ingredients, instructions)
    if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
      throw new Error('Invalid recipe structure from AI');
    }

    return recipe;
  } catch (error: any) {
    console.error('Error generating recipe with Gemini:', error);
    throw new Error(`AI recipe generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * ✅ FIXED: Save recipe to Firestore (v6 compatible)
 */
export const saveGeneratedRecipe = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { recipe, videoUrl } = request.data;

  if (!recipe || !videoUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'Recipe and video URL are required');
  }

  try {
    const db = admin.firestore();
    const recipesRef = db.collection('recipes');

    const recipeData = {
      ...recipe,
      videoUrl,
      ownerId: request.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isPublic: false, // Default to private
    };

    const docRef = await recipesRef.add(recipeData);
    
    return { id: docRef.id, ...recipeData };

  } catch (error: any) {
    console.error('Error saving recipe:', error);
    throw new functions.https.HttpsError('internal', 'Failed to save recipe: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

/**
 * ✅ FIXED: Get user's recipes (v6 compatible)
 */
export const getUserRecipes = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const db = admin.firestore();
    const recipesRef = db.collection('recipes');
    
    const snapshot = await recipesRef
      .where('ownerId', '==', request.auth.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { recipes };

  } catch (error: any) {
    console.error('Error getting user recipes:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get recipes');
  }
});