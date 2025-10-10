import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: 'h',
      route: '/p/h/',
      icon: 'house.fill',
      label: 'Home',
    },
     {
      name: 'triage',  // This should work since triage.tsx is in /p/
      route: '/p/triage',
      icon: 'heart.text.square.fill',
      label: 'Triage',
    },
    {
      name: 'emergency',
      route: '/p/emergency',
      icon: 'exclamationmark.triangle.fill',
      label: 'Emergency',
    },
    {
      name: 'appointments',
      route: '/p/appointments',
      icon: 'calendar',
      label: 'Appointments',
    },
    {
      name: 'profile',
      route: '/p/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="h">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="triage">
          <Icon sf="heart.text.square.fill" drawable="ic_triage" />
          <Label>Triage</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="emergency">
          <Icon sf="exclamationmark.triangle.fill" drawable="ic_emergency" />
          <Label>Emergency</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="appointments">
          <Icon sf="calendar" drawable="ic_calendar" />
          <Label>Appointments</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
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
        <Stack.Screen name="h" />
        <Stack.Screen name="triage" />
        <Stack.Screen name="emergency" />
        <Stack.Screen name="appointments" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
