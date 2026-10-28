import React from 'react';
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
        tabBarActiveTintColor: COLORS.emerald[600],
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTripsStack}
        options={{
          tabBarLabel: 'Qidiruv',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Trips"
        component={DirectTripsStack}
        options={{
          tabBarLabel: 'Reyslar',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Safarlarim',
          tabBarIcon: ({ color, size }) => <Ticket size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          tabBarLabel: 'Chegara',
          tabBarIcon: ({ color, size }) => <ShieldCheck size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
