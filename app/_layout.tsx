import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '../store';

export default function RootLayout() {
  const initialize = useStore((state) => state.initialize);
  useEffect(() => { initialize(); }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-plant" options={{ title: 'New Plant', presentation: 'modal' }} />
        <Stack.Screen name="plant/[id]" options={{ title: 'Plant Details' }} />
        <Stack.Screen name="care-log" options={{ title: 'Log Care Activity', presentation: 'modal' }} />
        <Stack.Screen name="environment" options={{ title: 'Log Environment', presentation: 'modal' }} />
        <Stack.Screen name="growth-snapshot" options={{ title: 'Growth Snapshot', presentation: 'modal' }} />
        <Stack.Screen name="harvest-data" options={{ title: 'Harvest Data', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
