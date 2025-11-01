import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { validateVideoUrl } from '../services/videoService';

interface RecipeFormProps {
  onGenerateRecipe: (url: string) => void;
  isLoading: boolean;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onGenerateRecipe, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleGenerate = () => {
    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Please enter a video URL');
      return;
    }

    const platform = validateVideoUrl(videoUrl);
    if (platform.type === 'unknown') {
      Alert.alert('Invalid URL', 'Please enter a valid YouTube, TikTok, or Instagram URL');
      return;
    }

    onGenerateRecipe(videoUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Transform Video to Recipe
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Paste YouTube, TikTok, or Instagram URL..."
        value={videoUrl}
        onChangeText={setVideoUrl}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />
      
      <TouchableOpacity
        style={[styles.button, isLoading ? styles.buttonDisabled : null]}
        onPress={handleGenerate}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Generating Recipe...' : '🍳 Generate Recipe'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android elevation
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});