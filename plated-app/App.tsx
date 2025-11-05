// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./assets/6.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <Image 
        source={require('./assets/6.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <AppNavigator user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '113%',
    height: '105%',
    alignSelf: 'center',
  },
});