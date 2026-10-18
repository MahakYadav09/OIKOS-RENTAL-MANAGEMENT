import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useContext, useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PropertyProvider } from '@/context/OwnPropertyListProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AllBookingsProvider } from '@/context/host/AllBookingsContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <AllBookingsProvider>
        <KeyboardProvider>
          <PropertyProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="detail/reservationDetail/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="detail/dateDetail" options={{ headerShown: false }} />
                <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="detail/listingProcess/startSetup" options={{ headerShown: false }} />
                <Stack.Screen name="detail/listingProcess/hostListingScreen" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </PropertyProvider>
        </KeyboardProvider>
      </AllBookingsProvider>
    </GestureHandlerRootView>
  );
}
