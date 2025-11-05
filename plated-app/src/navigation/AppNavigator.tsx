// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from '../screens/AuthScreen';
import { TabNavigator } from './TabNavigator';
import { User } from 'firebase/auth';
import { Recipe } from '../types/recipe';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  RecipeDetail: { recipe: Recipe }; // ✅ Add this

};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  user: User | null;
}

export const AppNavigator = ({ user }: AppNavigatorProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User is signed in - show Tab Navigator
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="RecipeDetail" 
              component={RecipeDetailScreen}
              options={{ 
                headerShown: true, 
                title: 'Recipe Details',
                headerStyle: {
                  backgroundColor: '#267F53',
                },
                headerTintColor: 'white',
              }}
            />
          </>

        ) : (
          // User is signed out - show AuthScreen
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};