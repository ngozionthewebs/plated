// src/screens/CommunityScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Recipe } from '../types/recipe';
import { getPublicRecipes } from '../services/databaseService';
import { Users, Clock, ChefHat, Calendar, Globe, Heart } from 'lucide-react-native';
import { Timestamp } from 'firebase/firestore';

export const CommunityScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
    // Navigate to RecipeDetailScreen
    navigation.navigate('RecipeDetail', { recipe });
  };

  // Helper function to convert Timestamp to Date
  const convertToDate = (timestamp: Timestamp | Date | undefined): Date => {
    if (!timestamp) return new Date(0);
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  };

  const formatDate = (date: Timestamp | Date | undefined) => {
    if (!date) return 'Recently';
    const recipeDate = convertToDate(date);
    return recipeDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Simplified user display name - just show "Chef" with shortened ID
  const getUserDisplayName = (recipe: Recipe) => {
    return `Chef ${recipe.ownerId?.slice(0, 6) || 'Anonymous'}`;
  };

  
  const showLikes = () => {
    return "0 likes"; // Static for demo
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.minimalHeader}>
          <Text style={styles.minimalTitle}>Community</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading community recipes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.minimalHeader}>
        <Text style={styles.minimalTitle}>Community</Text>
        <Text style={styles.recipeCount}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id || item.title}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            {/* Recipe Header with User Info */}
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <ChefHat size={16} color="#6D9CFF" />
                </View>
                <View>
                  <Text style={styles.userName}>{getUserDisplayName(item)}</Text>
                  <Text style={styles.recipeDate}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>
              <View style={styles.publicBadge}>
                <Globe size={14} color="#6B7280" />
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            {/* Recipe Content */}
            <View style={styles.recipeContent}>
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.recipeDescription} numberOfLines={2}>
                {item.ingredients?.slice(0, 3).join(', ')}...
              </Text>
            </View>

            {/* Recipe Metadata */}
            <View style={styles.metadataContainer}>
              {item.prepTime && (
                <View style={styles.metadataItem}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.metadataText}>{item.prepTime}</Text>
                </View>
              )}
              {item.servings && (
                <View style={styles.metadataItem}>
                  <Users size={14} color="#6B7280" />
                  <Text style={styles.metadataText}>{item.servings} servings</Text>
                </View>
              )}
              {item.difficulty && (
                <View style={[styles.metadataItem, styles.difficultyItem]}>
                  <View style={[
                    styles.difficultyDot,
                    item.difficulty === 'Easy' && styles.difficultyEasy,
                    item.difficulty === 'Medium' && styles.difficultyMedium,
                    item.difficulty === 'Hard' && styles.difficultyHard,
                  ]} />
                  <Text style={styles.metadataText}>{item.difficulty}</Text>
                </View>
              )}
              <View style={styles.metadataItem}>
                <Heart size={14} color="#6B7280" />
                <Text style={styles.likesText}>{showLikes()}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => handleRecipePress(item)}
              >
                <Text style={styles.viewButtonText}>View Recipe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
                <Heart size={16} color="#6B7280" />
                <Text style={styles.likeButtonText}>Like</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6D9CFF']}
            tintColor="#6D9CFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          recipes.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Users size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Community Recipes</Text>
            <Text style={styles.emptyText}>
              Be the first to share a recipe with the community!
            </Text>
            <TouchableOpacity style={styles.shareButton}>
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>Share Your Recipe</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  minimalHeader: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minimalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  recipeCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Recipe Card Styles
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  recipeDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  publicText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  recipeContent: {
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 24,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyItem: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyEasy: {
    backgroundColor: '#10B981',
  },
  difficultyMedium: {
    backgroundColor: '#F59E0B',
  },
  difficultyHard: {
    backgroundColor: '#EF4444',
  },
  difficultyExpert: {
    backgroundColor: '#7C3AED',
  },
  metadataText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  likesText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#267F53',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  likeButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  likeButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6D9CFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});