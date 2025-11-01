import { Timestamp } from 'firebase/firestore';

export interface Recipe {
  id?: string; // Made optional since it might not exist before saving
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  ownerId: string;
  createdAt: Timestamp | Date;
  isPublic: boolean;
  // New fields for AI enhancement
  sourcePlatform?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

export interface RecipeFormData {
  videoUrl: string;
  title?: string;
  isPublic?: boolean;
}

export interface AIRecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

// For creating new recipes
export interface CreateRecipeData {
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  ownerId: string;
  isPublic: boolean;
  sourcePlatform?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
}