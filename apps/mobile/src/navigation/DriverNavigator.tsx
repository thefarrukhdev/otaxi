import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/driver/DashboardScreen';
import { CreateTripScreen } from '../screens/driver/CreateTripScreen';
import { ActiveTripScreen } from '../screens/driver/ActiveTripScreen';
import { WalletScreen } from '../screens/driver/WalletScreen';
import { VerificationScreen } from '../screens/driver/VerificationScreen';
import { LayoutDashboard, PlusCircle, Car, Wallet, ShieldCheck } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const DriverNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <LayoutDashboard size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CreateTrip"
        component={CreateTripScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <PlusCircle size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Car size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Wallet size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <ShieldCheck size={focused ? 20 : 19} color={focused ? '#FF8800' : '#8A92A6'} strokeWidth={focused ? 2.6 : 2} />
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
