import { getFunctions, httpsCallable } from 'firebase/functions';
import { Recipe, AIRecipeResponse } from '../types/recipe';

export const generateRecipeFromVideo = async (videoUrl: string): Promise<Recipe> => {
  try {
    console.log('🔄 Calling Cloud Function with URL:', videoUrl);
    
    const functions = getFunctions();
    
    // Use the callable function
    const generateRecipeCallable = httpsCallable<{ videoUrl: string }, AIRecipeResponse>(
      functions, 
      'generateRecipeFromVideo'
    );
    
    const result = await generateRecipeCallable({ videoUrl });
    
    console.log('✅ Cloud Function response received:', result.data);
    
    const recipeData = result.data;
    
    // ✅ ADD DEBUGGING: Check what we're receiving
    console.log('📊 Recipe data structure:', {
      hasTitle: !!recipeData.title,
      title: recipeData.title,
      ingredientsCount: recipeData.ingredients?.length,
      instructionsCount: recipeData.instructions?.length,
      fullData: recipeData
    });

    // ✅ ENHANCED VALIDATION: Check if we have the minimum required data
    if (!recipeData.title || !Array.isArray(recipeData.ingredients) || !Array.isArray(recipeData.instructions)) {
      console.error('❌ Invalid recipe data structure:', recipeData);
      throw new Error('AI generated incomplete recipe data. Please try again.');
    }

    // ✅ FIXED: Create proper Recipe object matching your type
    const recipe: Recipe = {
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      videoUrl: videoUrl,
      ownerId: '', // Will be set when saved
      createdAt: new Date(),
      isPublic: false,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      tags: recipeData.tags || [], // Default to empty array
    };

    console.log('🎉 Final recipe object:', recipe);
    return recipe;

  } catch (error: any) {
    console.error('❌ Error in generateRecipeFromVideo service:', error);
    
    // ✅ BETTER ERROR MESSAGES (integrated from my version)
    if (error.message.includes('unauthenticated')) {
      throw new Error('Please log in to generate recipes');
    } else if (error.message.includes('invalid-argument')) {
      throw new Error('Please provide a valid video URL');
    } else if (error.message.includes('AI generated incomplete')) {
      throw error; // Keep our custom message
    } else {
      throw new Error('Failed to generate recipe: ' + error.message);
    }
  }
};

// Save recipe function (keep your existing version, just add logging)
export const saveRecipeToCloud = async (recipe: Recipe, videoUrl: string) => {
  try {
    console.log('💾 Saving recipe to cloud:', recipe.title);
    
    const functions = getFunctions();
    const saveRecipeCallable = httpsCallable<
      { recipe: AIRecipeResponse; videoUrl: string }, 
      { id: string }
    >(functions, 'saveGeneratedRecipe');
    
    const result = await saveRecipeCallable({ 
      recipe: {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        tags: recipe.tags || [], // Ensure tags is always defined
      },
      videoUrl 
    });

    console.log('✅ Recipe saved successfully with ID:', result.data.id);
    return result.data;

  } catch (error) {
    console.error('❌ Error saving recipe to cloud:', error);
    throw new Error('Failed to save recipe.');
  }
};