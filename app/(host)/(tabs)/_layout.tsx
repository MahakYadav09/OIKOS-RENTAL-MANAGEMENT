import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppWindowMac, Bolt, Bookmark, Calendar, Heart, MessageCircle, Rows3, Search, Settings2, TextAlignJustify } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
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
          title: 'Today',
          tabBarIcon: ({ color }) => <Bookmark size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calender"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <Calendar size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="listing"
        options={{
          title: 'Listing',
          tabBarIcon: ({ color }) => <AppWindowMac size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Message',
          tabBarIcon: ({ color }) => <MessageCircle size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <TextAlignJustify size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
