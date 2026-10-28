import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/passenger/HomeScreen';
import { TripsListScreen } from '../screens/passenger/TripsListScreen';
import { TripDetailsScreen } from '../screens/passenger/TripDetailsScreen';
import { BookingsScreen } from '../screens/passenger/BookingsScreen';
import { ChecklistScreen } from '../screens/passenger/ChecklistScreen';
import { ProfileScreen } from '../screens/passenger/ProfileScreen';
import { COLORS } from '../lib/theme';
import { Search, Compass, Ticket, ShieldCheck, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTripsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="TripsList" component={TripsListScreen} />
    <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
  </Stack.Navigator>
);

const DirectTripsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TripsListMain" component={TripsListScreen} />
    <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
  </Stack.Navigator>
);

export const PassengerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF8800',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#0C0D11',
          borderTopColor: '#1E222A',
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTripsStack}
        options={{
          tabBarLabel: 'Qidiruv',
          tabBarIcon: ({ color, focused }) => (
            <Search size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={DirectTripsStack}
        options={{
          tabBarLabel: 'Reyslar',
          tabBarIcon: ({ color, focused }) => (
            <Compass size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Safarlarim',
          tabBarIcon: ({ color, focused }) => (
            <Ticket size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          tabBarLabel: 'Chegara',
          tabBarIcon: ({ color, focused }) => (
            <ShieldCheck size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
