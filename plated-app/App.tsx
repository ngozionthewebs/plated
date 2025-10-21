import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { initializeApp } from 'firebase/app';

export default function App() {
  // Simple test to see if imports work
  const testFirebase = () => {
    try {
      console.log('Firebase imported successfully');
      alert('All dependencies are working!');
    } catch (error) {
      console.log('Firebase error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plated App</Text>
      <Text style={styles.subtitle}>Your cooking companion</Text>
      <Button title="Test Dependencies" onPress={testFirebase} />
      <Text style={styles.status}>✅ Expo is working</Text>
      <Text style={styles.status}>✅ React Native is working</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  status: {
    marginTop: 10,
    color: 'green',
  },
});