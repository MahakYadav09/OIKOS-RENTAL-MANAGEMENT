import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';
import { UserContext, UserProvider } from '@/context/guest/UserContext';
import { PropertyOnboardingProvider } from '@/context/host/propertyOnboarding';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Platform } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const { profile } = useContext(UserContext);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Replace this with your real auth logic (token, user fetch, etc.)
        const token = await AsyncStorage.getItem('loggedIn');
        if (!token) {
          // not logged in -> go to onboarding / login
          console.log("not login")
          router.replace('/_onboarding/onboarding');
        }
        else {
          router.replace('/(guest)/(tabs)');
        }
      } catch (err) {
        console.log("not login 2")
      } finally {
        setChecking(false);
      }
    }
    checkAuth();

  }, [router]);

  // useEffect(()=>{
  //   if(profile?.role === 'host'){
  //     router.push("/(host)/(tabs)")
  //   }else{
  //     router.push('/')
  //   }
  // },[profile])  

  // while checking auth, don't render tabs (avoids flash)
  // if (checking) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <UserProvider>
          <PropertyOnboardingProvider>
            <AuthProvider>
              <Tabs
                screenOptions={{
                  tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                  headerShown: false,
                  tabBarButton: HapticTab,
                  tabBarStyle: {
                    height: Platform.OS === 'ios' ? 90 : 70,
                    paddingTop: 8,
                    display: 'none'
                  },
                  tabBarLabelStyle: {
                    paddingTop: 2,
                    fontSize: 11
                  }
                }}>
                {/* ... your tab screens go here ... */}
              </Tabs>
            </AuthProvider>
          </PropertyOnboardingProvider>
        </UserProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
