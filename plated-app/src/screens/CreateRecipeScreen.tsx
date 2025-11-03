import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { RecipeForm } from '../components/RecipeForm';
import { getAuth } from 'firebase/auth';
import { GeneratedRecipe } from '../components/GeneratedRecipe';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { generateRecipeFromVideo } from '../services/recipeService';
import { Recipe } from '../types/recipe';
import { createRecipe } from '../services/databaseService';

export const CreateRecipeScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const handleGenerateRecipe = async (videoUrl: string) => {
    setIsLoading(true);
    setGeneratedRecipe(null);
    
    try {
      console.log('🎬 Starting recipe generation with URL:', videoUrl);
      
      const recipe = await generateRecipeFromVideo(videoUrl);
      
      console.log('🏠 CreateRecipeScreen - Recipe received:', recipe);
      console.log('📝 Recipe title:', recipe.title);
      console.log('🥕 Ingredients count:', recipe.ingredients?.length);
      console.log('👩‍🍳 Instructions count:', recipe.instructions?.length);
      
      // ✅ ENHANCED VALIDATION: Check if we have valid recipe data
      if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
        console.error('❌ Invalid recipe data in CreateRecipeScreen:', recipe);
        throw new Error('Received incomplete recipe data from AI');
      }

      // ✅ Check if arrays are empty
      if (recipe.ingredients.length === 0 || recipe.instructions.length === 0) {
        console.warn('⚠️ Recipe has empty arrays:', {
          ingredientsEmpty: recipe.ingredients.length === 0,
          instructionsEmpty: recipe.instructions.length === 0
        });
      }
      
      console.log('✅ Setting generated recipe in state');
      setGeneratedRecipe(recipe);
      
    } catch (error: any) {
      console.error('❌ Recipe generation error in CreateRecipeScreen:', error);
      
      // ✅ BETTER ERROR MESSAGES (integrated from my version)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate recipe. Please try again.';
      
      Alert.alert('Generation Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
const handleSaveRecipe = async (recipe: Recipe) => {
  try {
    console.log('💾 Saving recipe to database:', recipe.title);
    
    const auth = getAuth();
    const currentUser = auth.currentUser; // ✅ Rename to avoid conflict
    
    if (!currentUser) {
      throw new Error('User must be logged in to save recipes');
    }
    
    // Ensure recipe has ownerId from current user
    const recipeToSave = {
      ...recipe,
      ownerId: currentUser.uid, // ✅ Use the local user variable
      isPublic: false, // Default to private
      createdAt: new Date(),
    };
    
    console.log('📋 Recipe data being saved:', recipeToSave);
    
    await createRecipe(recipeToSave);
    Alert.alert('Success', 'Recipe saved to your cookbook!');
    setGeneratedRecipe(null);
  } catch (error) {
    console.error('❌ Save recipe error:', error);
    Alert.alert('Save Failed', 'Failed to save recipe. Please try again.');
  }
};

  // ✅ ADDED: Debugging for when generatedRecipe changes
  React.useEffect(() => {
    if (generatedRecipe) {
      console.log('🔄 generatedRecipe state updated:', {
        hasRecipe: !!generatedRecipe,
        title: generatedRecipe.title,
        ingredients: generatedRecipe.ingredients?.length,
        instructions: generatedRecipe.instructions?.length
      });
    }
  }, [generatedRecipe]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ padding: 16 }}>
        <RecipeForm 
          onGenerateRecipe={handleGenerateRecipe}
          isLoading={isLoading}
        />
        
        {generatedRecipe && (
          <GeneratedRecipe
            recipe={generatedRecipe}
            onSave={handleSaveRecipe}
            onReset={() => {
              console.log('🔄 Resetting generated recipe');
              setGeneratedRecipe(null);
            }}
          />
        )}
      </View>
      
      <LoadingOverlay visible={isLoading} message="AI is cooking up your recipe..." />
    </ScrollView>
  );
};