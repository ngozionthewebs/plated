import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../hooks/useAuth';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types/recipe';
import { getUserRecipes } from '../services/databaseService';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BookOpen, Clock, Users, Plus, Calendar } from 'lucide-react-native';

type CookbookStackParamList = {
  RecipeDetail: { recipe: Recipe };
};

export const CookbookScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthUser();

  const loadRecipes = async () => {
    if (!user) return;
    
    try {
      console.log('📚 Loading user recipes...');
      const result = await getUserRecipes(user.uid);
      console.log('✅ Recipes loaded:', result.length);
      setRecipes(result);
    } catch (error) {
      console.error('❌ Error loading recipes:', error);
      Alert.alert('Error', 'Failed to load your recipes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRecipes();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRecipes();
  };

  const handleRecipePress = (recipe: Recipe) => {
    console.log('🎯 Recipe pressed:', recipe.title);
    navigation.navigate('RecipeDetail', { recipe });
  };

  const formatDate = (date: any) => {
    if (!date) return 'Recently';
    const recipeDate = date.toDate ? date.toDate() : new Date(date);
    return recipeDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Show auth message if user not logged in
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.minimalHeader}>
          <Text style={styles.minimalTitle}>Cookbook</Text>
        </View>
        <View style={styles.emptyState}>
          <BookOpen size={48} color="#6B7280" />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to view your saved recipes
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.minimalHeader}>
          <Text style={styles.minimalTitle}>Cookbook</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading your recipes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.minimalHeader}>
        <Text style={styles.minimalTitle}>Cookbook</Text>
        <Text style={styles.recipeCount}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id || item.title}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.recipeCard}
            onPress={() => handleRecipePress(item)}
            activeOpacity={0.7}
          >
            {/* Recipe Header */}
            <View style={styles.cardHeader}>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {item.ingredients?.slice(0, 3).join(', ')}...
                </Text>
              </View>
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
              {item.createdAt && (
                <View style={styles.metadataItem}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.metadataText}>{formatDate(item.createdAt)}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => handleRecipePress(item)}
              >
                <Text style={styles.viewButtonText}>View Recipe</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
            <BookOpen size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Recipes Yet</Text>
            <Text style={styles.emptyText}>
              Start by creating your first recipe from a cooking video
            </Text>
            <TouchableOpacity style={styles.createButton}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Recipe</Text>
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
    backgroundColor: '#f8fafc',
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
    marginBottom: 16,
  },
  recipeInfo: {
    flex: 1,
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
  metadataText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: '#267F53',
  },
  viewButtonText: {
    color: '#FFFFFF',
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6D9CFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});