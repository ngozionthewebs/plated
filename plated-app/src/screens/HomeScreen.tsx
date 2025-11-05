import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useAuthUser } from '../hooks/useAuth';
import { createRecipe } from '../services/databaseService';
import { Timestamp } from 'firebase/firestore';
import { CreateRecipeScreen } from './CreateRecipeScreen';
import { CookingPot, Cookie } from 'lucide-react-native';

export const HomeScreen = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'test'>('create');
  const user = useAuthUser();

  const handleSimpleTest = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setIsTesting(true);
    try {
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
        <Image 
          source={require('../../assets/6.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        <View style={styles.authMessageContainer}>
          <View style={styles.logoTitleContainer}>
            <Image 
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome to Plated! 👩‍🍳</Text>
          </View>
          <Text style={styles.subtitle}>Please sign in to start creating amazing recipes from videos!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Image - Full screen behind everything */}
      <Image 
        source={require('../../assets/6.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoTitleContainer}>
            <Image 
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome to Plated</Text>
          </View>
          <Text style={styles.subtitle}>
            Bringing recipes to life, one plate at a time.
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'create' && styles.activeTab]}
            onPress={() => setActiveTab('create')}
          >
            <CookingPot size={20} color={activeTab === 'create' ? '#6D9CFF' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
              Create Recipe
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === 'create' ? (
            <CreateRecipeScreen />
          ) : (
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
                <Cookie size={20} color="white" />
                <Text style={styles.testButtonText}>
                  {isTesting ? 'Creating Test Recipe...' : 'Create Test Recipe'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Important for absolute positioning
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '113%',
    height: '105%',
    alignSelf: 'center',
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'transparent', // Changed to transparent to see background
  },
  authMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent', // Make transparent to see background
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoTitleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6D9CFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  activeTab: {
    borderBottomColor: '#6D9CFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#6D9CFF',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent', // Make content area transparent
  },
  testContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent', // Make test container transparent
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#6D9CFF',
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
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
    backgroundColor: 'rgba(243, 244, 246, 0.9)', // Semi-transparent
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