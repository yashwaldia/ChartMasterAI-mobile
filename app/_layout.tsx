// app/_layout.tsx
import React, { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { AnalysisProvider } from '../hooks/useAnalysis';
import { initializeGlobalNotifications } from '../services/globalNotificationService';

export default function RootLayout() {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Initialize notifications on app start
    initializeGlobalNotifications();

    // Listen for when user taps a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, any>;
        
        console.log('👆 User tapped notification:', data);

        // Check if it's our global-intel notification
        if (data?.type === 'global-intel' && data?.autoGenerate) {
          console.log('🚀 Navigating to Global tab with auto-generate');
          
          // Navigate to global tab with autoGenerate flag
          router.push('/(tabs)/global?autoGenerate=true');
        }
      }
    );

    // Optional: Listen for notifications received while app is open (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 Notification received in foreground:', notification);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, []);

  return (
    <AnalysisProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="result/[id]" />
      </Stack>
    </AnalysisProvider>
  );
}