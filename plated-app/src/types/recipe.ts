import { Timestamp } from 'firebase/firestore';

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  ownerId: string;
  createdAt: Timestamp | Date;
  isPublic: boolean;
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
}

// For creating new recipes
export interface CreateRecipeData {
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  ownerId: string;
  isPublic: boolean;
}