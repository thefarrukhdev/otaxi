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
import { Search, Compass, Ticket, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTripsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="TripsList" component={TripsListScreen} />
    <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
    <Stack.Screen name="Checklist" component={ChecklistScreen} />
  </Stack.Navigator>
);

const DirectTripsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TripsListMain" component={TripsListScreen} />
    <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
    <Stack.Screen name="Checklist" component={ChecklistScreen} />
  </Stack.Navigator>
);

export const PassengerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF8800',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 14,
          right: 14,
          maxWidth: 480,
          marginHorizontal: 'auto',
          height: 64,
          borderRadius: 32,
          backgroundColor: '#15171E',
          borderWidth: 1.2,
          borderColor: '#272B35',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 12,
          paddingHorizontal: 8,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 2,
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTripsStack}
        options={{
          tabBarLabel: 'Qidiruv',
          tabBarIcon: ({ focused }) => (
            <Search size={22} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={DirectTripsStack}
        options={{
          tabBarLabel: 'Reyslar',
          tabBarIcon: ({ focused }) => (
            <Compass size={22} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Safarlarim',
          tabBarIcon: ({ focused }) => (
            <Ticket size={22} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused }) => (
            <User size={22} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});
