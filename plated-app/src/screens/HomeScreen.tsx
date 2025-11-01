import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthUser } from '../hooks/useAuth'; // Changed import path
import { createRecipe } from '../services/databaseService';
import { Timestamp } from 'firebase/firestore';

export const HomeScreen = () => {
  const [isTesting, setIsTesting] = useState(false);
  const user = useAuthUser(); // Now using the correct hook

  const handleSimpleTest = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setIsTesting(true);
    try {
      // Create a simple test recipe
      const testRecipe = {
        title: 'My First Test Recipe',
        ingredients: ['1 cup flour', '2 eggs', '1 tsp salt'],
        instructions: ['Mix everything', 'Bake at 350°F', 'Enjoy!'],
        videoUrl: 'https://example.com/test',
        ownerId: user.uid,
        createdAt: Timestamp.now(),
        isPublic: true
      };

      const recipeId = await createRecipe(testRecipe);
      Alert.alert('Success!', `Recipe created with ID: ${recipeId}\n\nCheck Firebase Console to see your new 'recipes' collection!`);
      
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Plated!</Text>
      <Text style={styles.subtitle}>Ready to create some amazing recipes?</Text>
      
      {/* Test Database Button */}
      <TouchableOpacity 
        onPress={handleSimpleTest} 
        disabled={isTesting}
        style={[
          styles.testButton,
          isTesting && styles.testButtonDisabled
        ]}
      >
        <Text style={styles.testButtonText}>
          {isTesting ? 'Creating Test Recipe...' : '🧪 Test Database'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  testButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    margin: 20,
    minWidth: 200,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});