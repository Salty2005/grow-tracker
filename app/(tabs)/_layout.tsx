import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1f2937', paddingBottom: 4, height: 56 },
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'My Plants', headerTitle: 'Grow Tracker', tabBarIcon: ({ color, size }) => <Ionicons name="leaf" size={size} color={color} /> }} />
      <Tabs.Screen name="guide" options={{ title: 'Guide', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }} />
      <Tabs.Screen name="deficiencies" options={{ title: 'Issues', tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle" size={size} color={color} /> }} />
    </Tabs>
  );
}
