// src/components/TabBarIcon.tsx
import React from 'react';
import { Home, Users, BookOpen, Settings } from 'lucide-react-native';
import { ColorValue } from 'react-native';

interface TabBarIconProps {
  name: 'home' | 'community' | 'cookbook' | 'settings';
  color: ColorValue;
  size: number;
}

export const TabBarIcon = ({ name, color, size }: TabBarIconProps) => {
  switch (name) {
    case 'home':
      return <Home size={size} color={color} />;
    case 'community':
      return <Users size={size} color={color} />;
    case 'cookbook':
      return <BookOpen size={size} color={color} />;
    case 'settings':
      return <Settings size={size} color={color} />;
    default:
      return <Home size={size} color={color} />;
  }
};