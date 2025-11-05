import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Recipe } from '../types/recipe';
import { Save, RotateCcw } from 'lucide-react-native'; // Import Lucide icons

interface GeneratedRecipeProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onReset: () => void;
}

export const GeneratedRecipe: React.FC<GeneratedRecipeProps> = ({ recipe, onSave, onReset }) => {
  // ✅ ADDED: Debugging when component receives props
  console.log('📦 GeneratedRecipe received props:', {
    hasRecipe: !!recipe,
    title: recipe?.title || 'No title',
    ingredientCount: recipe?.ingredients?.length || 0,
    instructionCount: recipe?.instructions?.length || 0,
    hasPrepTime: !!recipe?.prepTime,
    hasCookTime: !!recipe?.cookTime,
    hasServings: !!recipe?.servings,
    hasDifficulty: !!recipe?.difficulty,
    tagsCount: recipe?.tags?.length || 0
  });

  // ✅ ADDED: Debugging for empty arrays
  if (recipe?.ingredients?.length === 0) {
    console.warn('⚠️ GeneratedRecipe: ingredients array is empty');
  }
  if (recipe?.instructions?.length === 0) {
    console.warn('⚠️ GeneratedRecipe: instructions array is empty');
  }

  const handleSave = () => {
    console.log('💾 Save button pressed for recipe:', recipe.title);
    Alert.alert(
      'Save Recipe',
      'Would you like to save this recipe to your cookbook?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('❌ Save cancelled by user')
        },
        { 
          text: 'Save', 
          style: 'default', 
          onPress: () => {
            console.log('✅ User confirmed save for recipe:', recipe.title);
            onSave(recipe);
          }
        }
      ]
    );
  };

  const handleReset = () => {
    console.log('🔄 Reset button pressed');
    onReset();
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return 'Not specified';
    return time.toLowerCase().includes('min') ? time : `${time} mins`;
  };

  // ✅ ADDED: Safe rendering with fallbacks
  const safeIngredients = recipe.ingredients || [];
  const safeInstructions = recipe.instructions || [];
  const safeTags = recipe.tags || [];

  return (
    <View style={styles.glowingContainer}>
      {/* Glow Effects */}
      <View style={styles.glowEffect} />
      <View style={styles.glowEffect2} />
      
      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.header}>✨ AI-Generated Recipe</Text>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Recipe Title with fallback */}
          <Text style={styles.title}>{recipe.title || 'Untitled Recipe'}</Text>
          
          {/* Recipe Metadata */}
          <View style={styles.metadataContainer}>
            {recipe.prepTime && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Prep</Text>
                <Text style={styles.metadataValue}>{formatTime(recipe.prepTime)}</Text>
              </View>
            )}
            {recipe.cookTime && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Cook</Text>
                <Text style={styles.metadataValue}>{formatTime(recipe.cookTime)}</Text>
              </View>
            )}
            {recipe.servings && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Servings</Text>
                <Text style={styles.metadataValue}>{recipe.servings}</Text>
              </View>
            )}
            {recipe.difficulty && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Difficulty</Text>
                <Text style={styles.metadataValue}>{recipe.difficulty}</Text>
              </View>
            )}
          </View>

          {/* Ingredients Section with safe rendering */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ingredients {safeIngredients.length > 0 && `(${safeIngredients.length})`}
            </Text>
            {safeIngredients.length > 0 ? (
              safeIngredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{ingredient}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No ingredients generated</Text>
            )}
          </View>

          {/* Instructions Section with safe rendering */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Instructions {safeInstructions.length > 0 && `(${safeInstructions.length})`}
            </Text>
            {safeInstructions.length > 0 ? (
              safeInstructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No instructions generated</Text>
            )}
          </View>

          {/* Tags with safe rendering */}
          {safeTags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {safeTags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
          >
            <Save size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>Save to Cookbook</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
          >
            <RotateCcw size={20} color="#6B7280" />
            <Text style={styles.resetButtonText}>Try Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glowingContainer: {
    position: 'relative',
    marginVertical: 8,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: '#99B7F7',
    borderRadius: 16,
    opacity: 0.4,
    zIndex: 0,
  },
  glowEffect2: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    zIndex: 1,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    zIndex: 2,
    position: 'relative',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android elevation
    elevation: 6,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metadataItem: {
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#6D9CFF', // Changed to purple
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: '#6D9CFF', // Changed to purple
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#267F53', // Green color
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  // ✅ ADDED: Style for empty state text
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 8,
  },
});