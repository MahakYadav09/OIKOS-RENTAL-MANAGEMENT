import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PropertyListContextProvider } from '@/context/guest/PropertyListContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookingProvider } from '@/context/guest/BookingListContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BookingProvider>
        <PropertyListContextProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="detail/bookingDetail/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="detail/confirm/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="detail/personalDetail" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </PropertyListContextProvider>
      </BookingProvider>
    </ThemeProvider>
  );
}
