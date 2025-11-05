// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { CookbookScreen } from '../screens/CookbookScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TabBarIcon } from '../components/TabBarIcon';

export type TabParamList = {
  Home: undefined;
  Community: undefined;
  Cookbook: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: 'home' | 'community' | 'cookbook' | 'settings';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Community':
              iconName = 'community';
              break;
            case 'Cookbook':
              iconName = 'cookbook';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'home';
          }

          return <TabBarIcon name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#7FA7FC',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#267F53',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Cookbook" 
        component={CookbookScreen}
        options={{ title: 'My Cookbook' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};
