// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AnalysisProvider } from '../hooks/useAnalysis';

export default function RootLayout() {
  return (
    <AnalysisProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="result/[id]" />
      </Stack>
    </AnalysisProvider>
  );
}
