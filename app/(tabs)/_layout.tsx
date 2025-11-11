import { Tabs } from 'expo-router';
import React from 'react';
import Icon from '@/components/common/Icon';
import { theme } from '@/styles/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceFaded,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.primaryTransparent,
          height: Platform.OS === 'ios' ? 88 : 64, // Standard heights for iOS (with safe area) and Android
          paddingTop: 8, // Increase top padding
          paddingBottom: Platform.OS === 'ios' ? 24 : 8, // More bottom padding on iOS for home indicator
        },
        tabBarItemStyle: {
          paddingVertical: 4, // Add vertical padding to tab items
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'System',
          fontWeight: '500',
          marginTop: 4, // Space between icon and label
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4, // Push icon down slightly for better centering
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ritual',
          tabBarIcon: ({ color }) => <Icon name="timer" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <Icon name="chart" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="mentor"
        options={{
          title: 'Mentor',
          tabBarIcon: ({ color }) => <Icon name="sparkles" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon name="settings" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}