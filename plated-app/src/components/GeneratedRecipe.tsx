import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Recipe } from '../types/recipe';

interface GeneratedRecipeProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onReset: () => void;
}

export const GeneratedRecipe: React.FC<GeneratedRecipeProps> = ({ recipe, onSave, onReset }) => {
  const handleSave = () => {
    Alert.alert(
      'Save Recipe',
      'Would you like to save this recipe to your cookbook?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', style: 'default', onPress: () => onSave(recipe) }
      ]
    );
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return 'Not specified';
    return time.toLowerCase().includes('min') ? time : `${time} mins`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✨ AI-Generated Recipe</Text>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipe Title */}
        <Text style={styles.title}>{recipe.title}</Text>
        
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

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
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
          <Text style={styles.saveButtonText}>💾 Save to Cookbook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={onReset}
        >
          <Text style={styles.resetButtonText}>🔄 Try Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android elevation
    elevation: 4,
    maxHeight: 500, // Limit height with scroll
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
    color: '#3B82F6',
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
    backgroundColor: '#3B82F6',
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
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
});