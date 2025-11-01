// src/screens/CommunityScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CommunityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Feed</Text>
      <Text style={styles.subtitle}>See what others are cooking!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});