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
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Boshqaruv',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CreateTrip"
        component={CreateTripScreen}
        options={{
          tabBarLabel: 'Yangi reys',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
        options={{
          tabBarLabel: 'Faol reys',
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Hamyon',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          tabBarLabel: 'Hujjatlar',
          tabBarIcon: ({ color, size }) => <ShieldCheck size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
