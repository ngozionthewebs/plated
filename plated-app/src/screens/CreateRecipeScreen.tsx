import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { RecipeForm } from '../components/RecipeForm';
import { GeneratedRecipe } from '../components/GeneratedRecipe';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { generateRecipeFromVideo } from '../services/recipeService';
import { Recipe } from '../types/recipe';
import { createRecipe } from '../services/databaseService'; // ✅ Fixed import

export const CreateRecipeScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const handleGenerateRecipe = async (videoUrl: string) => {
    setIsLoading(true);
    setGeneratedRecipe(null);
    
    try {
      const recipe = await generateRecipeFromVideo(videoUrl);
      setGeneratedRecipe(recipe);
    } catch (error) {
      Alert.alert('Generation Failed', 'Failed to generate recipe. Please try again.');
      console.error('Recipe generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      // ✅ Use createRecipe instead of saveRecipeToFirestore
      await createRecipe(recipe);
      Alert.alert('Success', 'Recipe saved to your cookbook!');
      setGeneratedRecipe(null);
    } catch (error) {
      Alert.alert('Save Failed', 'Failed to save recipe. Please try again.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ padding: 16 }}>
        {/* ✅ Remove the extra 'c' character that was here */}
        <RecipeForm 
          onGenerateRecipe={handleGenerateRecipe}
          isLoading={isLoading}
        />
        
        {generatedRecipe && (
          <GeneratedRecipe
            recipe={generatedRecipe}
            onSave={handleSaveRecipe}
            onReset={() => setGeneratedRecipe(null)}
          />
        )}
      </View>
      
      <LoadingOverlay visible={isLoading} message="AI is cooking up your recipe..." />
    </ScrollView>
  );
};