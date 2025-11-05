// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User, Shield, Bell, HelpCircle } from 'lucide-react-native';

export const SettingsScreen = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const user = auth.currentUser;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <User size={24} color="#6D9CFF" />
          <Text style={styles.cardTitle}>Account Information</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userSince}>
            Member since {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'recently'}
          </Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Bell size={24} color="#6D9CFF" />
          <Text style={styles.cardTitle}>Notifications</Text>
        </View>
        <Text style={styles.cardDescription}>
          Manage your notification preferences
        </Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Configure Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Shield size={24} color="#6D9CFF" />
          <Text style={styles.cardTitle}>Privacy & Security</Text>
        </View>
        <Text style={styles.cardDescription}>
          Control your privacy settings
        </Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Privacy Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HelpCircle size={24} color="#6D9CFF" />
          <Text style={styles.cardTitle}>Support</Text>
        </View>
        <Text style={styles.cardDescription}>
          Get help and support
        </Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Section */}
      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Plated v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  userInfo: {
    marginTop: 8,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  userSince: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionButton: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  signOutSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    gap: 8,
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});