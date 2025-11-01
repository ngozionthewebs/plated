import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuthUser } from '../hooks/useAuth';
import { createRecipe } from '../services/databaseService';
import { Timestamp } from 'firebase/firestore';
import { CreateRecipeScreen } from './CreateRecipeScreen'; // We'll add this import

export const HomeScreen = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'test'>('create'); // Tab state
  const user = useAuthUser();

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

  // Show auth message if user not logged in
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Plated! 👩‍🍳</Text>
        <Text style={styles.subtitle}>Please sign in to start creating amazing recipes from videos!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Plated! 👩‍🍳</Text>
        <Text style={styles.subtitle}>
          Transform cooking videos into structured recipes with AI
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            🍳 Create Recipe
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'test' && styles.activeTab]}
          onPress={() => setActiveTab('test')}
        >
          <Text style={[styles.tabText, activeTab === 'test' && styles.activeTabText]}>
            🧪 Test DB
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === 'create' ? (
          // Create Recipe Screen Content
          <CreateRecipeScreen />
        ) : (
          // Test Database Content
          <ScrollView style={styles.testContainer}>
            <Text style={styles.testTitle}>Database Testing</Text>
            <Text style={styles.testDescription}>
              Use this section to test Firebase Firestore connectivity and recipe creation.
            </Text>
            
            <TouchableOpacity 
              onPress={handleSimpleTest} 
              disabled={isTesting}
              style={[
                styles.testButton,
                isTesting && styles.testButtonDisabled
              ]}
            >
              <Text style={styles.testButtonText}>
                {isTesting ? 'Creating Test Recipe...' : '🧪 Create Test Recipe'}
              </Text>
            </TouchableOpacity>

            <View style={styles.testInfo}>
              <Text style={styles.infoTitle}>What this tests:</Text>
              <Text style={styles.infoItem}>• Firebase Firestore connection</Text>
              <Text style={styles.infoItem}>• Recipe creation service</Text>
              <Text style={styles.infoItem}>• Database security rules</Text>
              <Text style={styles.infoItem}>• User authentication</Text>
            </View>
          </ScrollView>
        )}
      </View>
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
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  testContainer: {
    flex: 1,
    padding: 20,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  testDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  testButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 24,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  testInfo: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  infoItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});