import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/driver/DashboardScreen';
import { CreateTripScreen } from '../screens/driver/CreateTripScreen';
import { ActiveTripScreen } from '../screens/driver/ActiveTripScreen';
import { WalletScreen } from '../screens/driver/WalletScreen';
import { VerificationScreen } from '../screens/driver/VerificationScreen';
import { COLORS } from '../lib/theme';
import { LayoutDashboard, PlusCircle, Car, Wallet, ShieldCheck } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const DriverNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.amber[400],
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#090D16', // Cockpit Obsidian
          borderTopColor: '#1F2937',
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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Boshqaruv',
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboard size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateTrip"
        component={CreateTripScreen}
        options={{
          tabBarLabel: 'Yangi reys',
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
        options={{
          tabBarLabel: 'Faol reys',
          tabBarIcon: ({ color, focused }) => (
            <Car size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Hamyon',
          tabBarIcon: ({ color, focused }) => (
            <Wallet size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          tabBarLabel: 'Hujjatlar',
          tabBarIcon: ({ color, focused }) => (
            <ShieldCheck size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
