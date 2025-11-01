import { getFunctions, httpsCallable } from 'firebase/functions';
import { Recipe, AIRecipeResponse } from '../types/recipe';

export const generateRecipeFromVideo = async (videoUrl: string): Promise<Recipe> => {
  try {
    const functions = getFunctions();
    
    // Use the callable function
    const generateRecipeCallable = httpsCallable<{ videoUrl: string }, AIRecipeResponse>(
      functions, 
      'generateRecipeFromVideo'
    );
    
    const result = await generateRecipeCallable({ videoUrl });
    
    const recipeData = result.data;
    
    const recipe: Recipe = {
      title: recipeData.title || 'Untitled Recipe',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      videoUrl: videoUrl,
      ownerId: '', // Will be set when saved
      createdAt: new Date(),
      isPublic: false,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      tags: recipeData.tags,
    };
    
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe from video. Please try again.');
  }
};

// Save recipe function
export const saveRecipeToCloud = async (recipe: Recipe, videoUrl: string) => {
  try {
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
        tags: recipe.tags,
      },
      videoUrl 
    });
    
    return result.data;
  } catch (error) {
    console.error('Error saving recipe to cloud:', error);
    throw new Error('Failed to save recipe.');
  }
};