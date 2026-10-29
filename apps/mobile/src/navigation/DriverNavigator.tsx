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
        tabBarActiveTintColor: '#FF8800',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#0C0D11',
          borderTopColor: '#1E222A',
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 1,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Boshqaruv',
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboard size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateTrip"
        component={CreateTripScreen}
        options={{
          tabBarLabel: 'Yangi reys',
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
        options={{
          tabBarLabel: 'Faol reys',
          tabBarIcon: ({ color, focused }) => (
            <Car size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Hamyon',
          tabBarIcon: ({ color, focused }) => (
            <Wallet size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          tabBarLabel: 'Hujjatlar',
          tabBarIcon: ({ color, focused }) => (
            <ShieldCheck size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
