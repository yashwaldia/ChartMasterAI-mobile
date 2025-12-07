// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const theme = Colors.dark;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedText,
        tabBarStyle: {
          backgroundColor: theme.headerBackground,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          // DO NOT force height or paddingBottom—let the navigator handle safe area
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Rajdhani',
        },
      }}
    >
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Stock',
          tabBarIcon: ({ color }) => <TabIcon name="trending-up" color={color} />,
        }}
      />
      <Tabs.Screen
        name="global"
        options={{
          title: 'Global',
          tabBarIcon: ({ color }) => <TabIcon name="globe" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <TabIcon name="information-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons name={name} size={24} color={color} />;
}
