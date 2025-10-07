import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
    {
      name: 'appointments',
      route: '/(tabs)/appointments',
      icon: 'calendar',
      label: 'Appointments',
    },
    {
      name: 'emergency',
      route: '/(tabs)/emergency',
      icon: 'exclamationmark.triangle.fill',
      label: 'Emergency',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="appointments">
          <Icon sf="calendar" drawable="ic_calendar" />
          <Label>Appointments</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="emergency">
          <Icon sf="exclamationmark.triangle.fill" drawable="ic_emergency" />
          <Label>Emergency</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Remove fade animation to prevent black screen flash
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="appointments" />
        <Stack.Screen name="emergency" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
