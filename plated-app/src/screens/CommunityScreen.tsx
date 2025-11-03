// src/screens/CommunityScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { CommunityRecipeCard } from '../components/CommunityRecipeCard';
import { Recipe } from '../types/recipe';
import { getPublicRecipes } from '../services/databaseService';

export const CommunityScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPublicRecipes = async () => {
    try {
      console.log('👥 Loading community recipes...');
      const publicRecipes = await getPublicRecipes();
      console.log('✅ Community recipes loaded:', publicRecipes.length);
      setRecipes(publicRecipes);
    } catch (error) {
      console.error('❌ Error loading community recipes:', error);
      Alert.alert('Error', 'Failed to load community recipes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPublicRecipes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPublicRecipes();
  };

  const handleRecipePress = (recipe: Recipe) => {
    console.log('🎯 Community recipe pressed:', recipe.title);
    // Navigate to RecipeDetailScreen (same as cookbook)
  };

  // Generate random emoji for demo (in real app, this would come from user profile)
  const getRandomChefEmoji = () => {
    const emojis = ['👨‍🍳', '👩‍🍳', '🧑‍🍳', '🍳', '🥘', '🍲', '👨‍💻', '👩‍💻'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Recipes</Text>
        <Text style={styles.subtitle}>Discover recipes from other food lovers</Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id || item.title}
        renderItem={({ item }) => (
          <CommunityRecipeCard
            recipe={item}
            userDisplayName={item.ownerId ? `Chef ${item.ownerId.slice(0, 6)}` : 'Anonymous Chef'}
            userEmoji={getRandomChefEmoji()}
            onPress={handleRecipePress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Community Recipes Yet</Text>
            <Text style={styles.emptyText}>
              Be the first to share a recipe with the community!
            </Text>
          </View>
        }
      />
    </View>
  );
};

// Add this at the bottom of CommunityScreen.tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});