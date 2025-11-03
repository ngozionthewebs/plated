import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const handlePress = () => {
    onPress(recipe);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        
        <View style={styles.metadata}>
          {recipe.prepTime && (
            <Text style={styles.metaText}>⏱️ {recipe.prepTime}</Text>
          )}
          {recipe.difficulty && (
            <Text style={styles.metaText}>📊 {recipe.difficulty}</Text>
          )}
          {recipe.servings && (
            <Text style={styles.metaText}>👥 {recipe.servings}</Text>
          )}
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewText} numberOfLines={2}>
            🥕 {recipe.ingredients.slice(0, 3).join(', ')}
            {recipe.ingredients.length > 3 && '...'}
          </Text>
        </View>

        {recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.tags}>
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {recipe.tags.length > 2 && (
              <Text style={styles.moreTags}>+{recipe.tags.length - 2} more</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
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
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
  moreTags: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});