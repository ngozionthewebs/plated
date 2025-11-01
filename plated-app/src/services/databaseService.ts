//src/services/databaseService.ts

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  Timestamp,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Recipe } from '../types/recipe';

// Recipe collection reference
const recipesCollection = collection(db, 'recipes');

/**
 * Create a new recipe in Firestore
 */
export const createRecipe = async (recipeData: Omit<Recipe, 'id'>): Promise<string> => {
  try {
    // Add createdAt timestamp if not provided
    const recipeWithTimestamp = {
      ...recipeData,
      createdAt: recipeData.createdAt || Timestamp.now(),
    };

    const docRef = await addDoc(recipesCollection, recipeWithTimestamp);
    console.log('Recipe created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw new Error('Failed to create recipe');
  }
};

/**
 * Get a single recipe by ID
 */
export const getRecipeById = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const docRef = doc(db, 'recipes', recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Recipe;
    } else {
      console.log('No such recipe found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw new Error('Failed to get recipe');
  }
};

/**
 * Get all recipes for a specific user
 */
export const getUserRecipes = async (userId: string): Promise<Recipe[]> => {
  try {
    const q = query(
      recipesCollection,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return convertSnapshotToRecipes(querySnapshot);
  } catch (error) {
    console.error('Error getting user recipes:', error);
    throw new Error('Failed to get user recipes');
  }
};

/**
 * Get all public recipes (for community feed)
 */
export const getPublicRecipes = async (): Promise<Recipe[]> => {
  try {
    const q = query(
      recipesCollection,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return convertSnapshotToRecipes(querySnapshot);
  } catch (error) {
    console.error('Error getting public recipes:', error);
    throw new Error('Failed to get public recipes');
  }
};

/**
 * Update an existing recipe
 */
export const updateRecipe = async (recipeId: string, updates: Partial<Recipe>): Promise<void> => {
  try {
    const docRef = doc(db, 'recipes', recipeId);
    await updateDoc(docRef, updates);
    console.log('Recipe updated successfully');
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw new Error('Failed to update recipe');
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'recipes', recipeId);
    await deleteDoc(docRef);
    console.log('Recipe deleted successfully');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
};

/**
 * Helper function to convert Firestore snapshot to Recipe array
 */
const convertSnapshotToRecipes = (snapshot: QuerySnapshot<DocumentData>): Recipe[] => {
  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title || 'Untitled Recipe',
    ingredients: doc.data().ingredients || [],
    instructions: doc.data().instructions || [],
    videoUrl: doc.data().videoUrl || '',
    ownerId: doc.data().ownerId || '',
    createdAt: doc.data().createdAt,
    isPublic: doc.data().isPublic !== undefined ? doc.data().isPublic : true,
  } as Recipe));
};

/**
 * Search recipes by title (case-insensitive)
 */
export const searchRecipes = async (searchTerm: string, userId?: string): Promise<Recipe[]> => {
  try {
    // Note: Firestore doesn't support case-insensitive search natively
    // This is a basic implementation - for production, consider Algolia or similar
    let q;
    if (userId) {
      q = query(
        recipesCollection,
        where('ownerId', '==', userId),
        orderBy('title')
      );
    } else {
      q = query(
        recipesCollection,
        where('isPublic', '==', true),
        orderBy('title')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const allRecipes = convertSnapshotToRecipes(querySnapshot);
    
    return allRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw new Error('Failed to search recipes');
  }
};