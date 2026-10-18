import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { UserContext } from '@/context/guest/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Heart, Rows3, Search, UserCircle } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile } = useContext(UserContext);
  console.log("profile", profile)

  const router = useRouter();
  useEffect(() => {
    if (profile?.role === 'host') {
      router.replace('/(host)/(tabs)')
    } else {
      router.replace('/(guest)/(tabs)')
    }
  }, [profile])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 80,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          paddingTop: 2,
          fontSize: 11
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="listing"
        options={{
          title: 'My Bookings',
          tabBarIcon: ({ color }) => <Rows3 size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <Heart size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserCircle size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
