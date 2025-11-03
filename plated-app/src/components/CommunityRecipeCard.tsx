import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Recipe } from '../types/recipe';
import { createRecipe } from '../services/databaseService';
import { useAuthUser } from '../hooks/useAuth';

interface CommunityRecipeCardProps {
  recipe: Recipe;
  userDisplayName?: string;
  userEmoji?: string;
  onPress: (recipe: Recipe) => void;
}

export const CommunityRecipeCard: React.FC<CommunityRecipeCardProps> = ({
  recipe,
  userDisplayName = 'Anonymous Chef',
  userEmoji = '👨‍🍳',
  onPress
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const user = useAuthUser();

  const handleSaveRecipe = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save recipes');
      return;
    }

    setIsSaving(true);
    try {
      // Create a copy of the recipe for the current user
      const recipeToSave = {
        ...recipe,
        ownerId: user.uid,
        isPublic: false, // Save as private by default
        createdAt: new Date(),
      };

      await createRecipe(recipeToSave);
      setIsSaved(true);
      Alert.alert('Success', 'Recipe saved to your cookbook!');
    } catch (error) {
      console.error('Error saving community recipe:', error);
      Alert.alert('Error', 'Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardPress = () => {
    onPress(recipe);
  };

  return (
    <View style={styles.card}>
      {/* User Header */}
      <View style={styles.headerRow}>
        <View style={styles.userHeader}>
          <Text style={styles.userEmoji}>{userEmoji}</Text>
          <Text style={styles.userName}>{userDisplayName}</Text>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            isSaved && styles.saveButtonSaved
          ]}
          onPress={handleSaveRecipe}
          disabled={isSaving || isSaved}
        >
          <Text style={styles.saveIcon}>
            {isSaving ? '⏳' : isSaved ? '✅' : '💾'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Recipe Content */}
      <TouchableOpacity onPress={handleCardPress}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.metadata}>
          {recipe.prepTime && <Text style={styles.metaText}>⏱️ {recipe.prepTime}</Text>}
          {recipe.difficulty && <Text style={styles.metaText}>📊 {recipe.difficulty}</Text>}
          {recipe.servings && <Text style={styles.metaText}>👥 {recipe.servings}</Text>}
        </View>

        <Text style={styles.preview} numberOfLines={2}>
          🥕 {recipe.ingredients.slice(0, 3).join(', ')}...
        </Text>

        {recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.tags}>
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  saveButtonSaved: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  saveIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#1D4ED8',
    fontWeight: '500',
  },
});