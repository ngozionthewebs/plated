import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai'; // ✅ Add OpenAI
import cors = require('cors');
import * as dotenv from 'dotenv';
dotenv.config();

admin.initializeApp();
const corsHandler = cors({ origin: true });

let openai: OpenAI;
function getOpenAI(): OpenAI {
  if (!openai) {
    // ✅ FIREBASE v2: Use environment variables directly
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is required. Set via environment variables or .env file');
    }
    
    openai = new OpenAI({ apiKey: openaiApiKey });
  }
  return openai;
}
// ✅ KEEP (commented out for now): Gemini initialization
// const geminiApiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
// if (!geminiApiKey) {
//   throw new Error('Gemini API key is required');
// }
// const genAI = new GoogleGenerativeAI(geminiApiKey);

// --------------------------------------------------------------------------

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
 * ✅ NEW: Extract video data from YouTube/TikTok URLs
 */
async function extractVideoData(videoUrl: string): Promise<{
  title: string;
  description: string;
  thumbnail: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
}> {
  try {
    // YouTube URL handling
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be') 
        ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
        : new URL(videoUrl).searchParams.get('v');
      
      // For demo purposes - in production, use YouTube API
      return {
        title: 'Cooking Video',
        description: 'A delicious recipe video',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        platform: 'youtube'
      };
    }
    
    // TikTok URL handling  
    else if (videoUrl.includes('tiktok.com')) {
      return {
        title: 'TikTok Cooking Video',
        description: 'Popular recipe from TikTok',
        thumbnail: '', // TikTok thumbnails require their API
        platform: 'tiktok'
      };
    }
    
    // Instagram URL handling
    else if (videoUrl.includes('instagram.com')) {
      return {
        title: 'Instagram Recipe Video', 
        description: 'Recipe from Instagram',
        thumbnail: '',
        platform: 'instagram'
      };
    }
    
    else {
      throw new Error('Unsupported video platform');
    }
  } catch (error) {
    console.error('Error extracting video data:', error);
    throw new Error('Could not process this video URL');
  }
}

/**
 * ✅ NEW: OpenAI GPT-4 Vision Recipe Generation
 */
async function generateRecipeWithOpenAI(videoUrl: string, videoData: any): Promise<AIRecipeResponse> {
  try {
    // Prepare messages for OpenAI
    const messages: any[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a creative chef and recipe developer. Based on this cooking video context, invent a delicious and practical recipe.

    VIDEO CONTEXT:
    - Platform: ${videoData.platform}
    - This is a cooking video showing food preparation

    IMPORTANT: You MUST create a complete recipe even if you have limited information. Be creative and practical.

    Create a realistic recipe with:
    1. An appealing, descriptive title
    2. Common ingredients with realistic quantities
    3. Clear, practical cooking instructions
    4. Reasonable time estimates
    5. Standard serving size
    6. Appropriate difficulty level
    7. Relevant cuisine/diet tags

    CRITICAL: Return ONLY valid JSON, no apologies or explanations. If you can't see specific details, make reasonable assumptions about a delicious recipe.

    Use this exact JSON format:
    {
      "title": "Delicious Creative Recipe",
      "ingredients": ["2 cups all-purpose flour", "1 tsp salt", "3 large eggs", "1 cup milk"],
      "instructions": ["Preheat oven to 375°F", "Mix dry ingredients in bowl", "Whisk wet ingredients separately", "Combine and bake for 25-30 minutes"],
      "prepTime": "15 mins",
      "cookTime": "30 mins", 
      "servings": "4",
      "difficulty": "Medium",
      "tags": ["baking", "comfort food", "family dinner"]
    }`
          }
        ]
      }
    ];

    // Add thumbnail image if available (YouTube)
    if (videoData.thumbnail) {
      messages[0].content.push({
        type: "image_url",
        image_url: {
          url: videoData.thumbnail,
        },
      });
    }

    // ✅ CHANGE THIS LINE - use getOpenAI() instead of openai
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1500,
    });

    const recipeText = completion.choices[0]?.message?.content;
    
    if (!recipeText) {
      throw new Error('No response from AI');
    }

    // Clean and parse the response
    const cleanText = recipeText.replace(/```json\n?|\n?```/g, '').trim();
    const recipe = JSON.parse(cleanText);

    // Validate required fields
    if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
      throw new Error('Invalid recipe structure from AI');
    }

    return recipe;

  } catch (error: any) {
    console.error('OpenAI recipe generation error:', error);
    throw new Error(`AI recipe generation failed: ${error.message}`);
  }
}

/**
 * ✅ UPDATED: Recipe generation function (now uses OpenAI)
 */
async function generateRecipeFromVideoUrl(videoUrl: string): Promise<AIRecipeResponse> {
  try {
    console.log('Starting OpenAI recipe generation for:', videoUrl);
    
    // Extract video data first
    const videoData = await extractVideoData(videoUrl);
    console.log('Video data extracted:', videoData.platform);
    
    // Generate recipe using OpenAI
    const recipe = await generateRecipeWithOpenAI(videoUrl, videoData);
    
    console.log('OpenAI recipe generated successfully:', recipe.title);
    return recipe;

  } catch (error: any) {
    console.error('Error in generateRecipeFromVideoUrl:', error);
    throw new Error(`Recipe generation failed: ${error.message}`);
  }
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

      console.log('Processing video URL (HTTP):', videoUrl);

      // ✅ NOW USES OPENAI instead of Gemini
      const recipe = await generateRecipeFromVideoUrl(videoUrl);

      console.log('Recipe generated successfully (HTTP):', recipe.title);
      res.status(200).json(recipe);

    } catch (error) {
      console.error('Error in generateRecipe (HTTP):', error);
      res.status(500).json({
        error: 'Failed to generate recipe: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    }
  });
});

/**
 * ✅ EXISTING FUNCTION - KEEP THIS AS IS (but now uses OpenAI internally)
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
    console.log('Processing video URL for user (Callable):', request.auth.uid);

    // ✅ NOW USES OPENAI instead of Gemini
    const recipe = await generateRecipeFromVideoUrl(videoUrl);

    console.log('Recipe generated successfully (Callable):', recipe.title);
    return recipe;

  } catch (error: any) {
    console.error('Error in generateRecipeFromVideo (Callable):', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate recipe: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

/**
 * ✅ EXISTING FUNCTION - KEEP THIS AS IS
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
 * ✅ EXISTING FUNCTION - KEEP THIS AS IS
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