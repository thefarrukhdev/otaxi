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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF8800',
        tabBarInactiveTintColor: '#8A92A6',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 14,
          right: 14,
          height: 64,
          borderRadius: 32,
          backgroundColor: '#15171E',
          borderWidth: 1.5,
          borderColor: '#272B35',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 12,
          paddingHorizontal: 8,
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
        tabBarIcon: undefined,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeTripsStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Search size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={DirectTripsStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Compass size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Ticket size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <ShieldCheck size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <User size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconCapsule: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCapsuleActive: {
    backgroundColor: 'rgba(255, 136, 0, 0.15)',
  },
});
