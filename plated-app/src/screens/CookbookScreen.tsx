import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { useAuthUser } from '../hooks/useAuth';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types/recipe';
import { getUserRecipes } from '../services/databaseService';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';


type CookbookStackParamList = {
  RecipeDetail: { recipe: Recipe };
  // add other routes here if needed
};
  
export const CookbookScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthUser();
  // Use the typed navigation instance above, do not redeclare navigation here

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

  // Show auth message if user not logged in
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Cookbook</Text>
        <Text style={styles.subtitle}>Please sign in to view your saved recipes</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Cookbook</Text>
        <Text style={styles.subtitle}>Loading your recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cookbook</Text>
        <Text style={styles.subtitle}>
          {recipes.length === 0 
            ? "You haven't saved any recipes yet" 
            : `${recipes.length} saved recipe${recipes.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id || item.title}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={handleRecipePress} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Recipes Yet</Text>
            <Text style={styles.emptyText}>
              Generate and save recipes from cooking videos to see them here!
            </Text>
          </View>
        }
      />
    </View>
  );
};

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