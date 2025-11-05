// src/screens/RecipeDetailScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Recipe } from '../types/recipe';

type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;
type RecipeDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetail'>;

interface RecipeDetailScreenProps {
  route: RecipeDetailScreenRouteProp;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation<RecipeDetailScreenNavigationProp>();

  const handleVideoPress = async () => {
    if (recipe.videoUrl) {
      const supported = await Linking.canOpenURL(recipe.videoUrl);
      
      if (supported) {
        await Linking.openURL(recipe.videoUrl);
      } else {
        Alert.alert('Error', 'Cannot open this video URL');
      }
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return 'Not specified';
    return time.toLowerCase().includes('min') ? time : `${time} mins`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Recipe Title */}
        <Text style={styles.title}>{recipe.title}</Text>
        
        {/* Recipe Metadata */}
        <View style={styles.metadataContainer}>
          {recipe.prepTime && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Prep Time</Text>
              <Text style={styles.metadataValue}>{formatTime(recipe.prepTime)}</Text>
            </View>
          )}
          {recipe.cookTime && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Cook Time</Text>
              <Text style={styles.metadataValue}>{formatTime(recipe.cookTime)}</Text>
            </View>
          )}
          {recipe.servings && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Servings</Text>
              <Text style={styles.metadataValue}>{recipe.servings}</Text>
            </View>
          )}
          {recipe.difficulty && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Difficulty</Text>
              <Text style={styles.metadataValue}>{recipe.difficulty}</Text>
            </View>
          )}
        </View>

        {/* Video Source */}
        {recipe.videoUrl && (
          <TouchableOpacity style={styles.videoSection} onPress={handleVideoPress}>
            <Text style={styles.videoTitle}>🎥 Watch Original Video</Text>
            <Text style={styles.videoUrl} numberOfLines={1}>
              {recipe.videoUrl}
            </Text>
          </TouchableOpacity>
        )}

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 32,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metadataItem: {
    alignItems: 'center',
    minWidth: '48%',
    marginBottom: 12,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  videoSection: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  videoUrl: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#374151',
  },
  ingredientsList: {
    // No additional styles needed
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#99B7F7',
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: '#4B5563',
  },
  instructionsList: {
    // No additional styles needed
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    backgroundColor: '#99B7F7',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#4B5563',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '500',
  },
});