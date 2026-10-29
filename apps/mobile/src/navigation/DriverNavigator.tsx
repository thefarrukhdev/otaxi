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
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 14,
          right: 14,
          maxWidth: 480,
          marginHorizontal: 'auto',
          height: 70,
          borderRadius: 35,
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
          paddingBottom: 8,
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
          lineHeight: 14,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Boshqaruv',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <LayoutDashboard size={focused ? 20 : 19} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CreateTrip"
        component={CreateTripScreen}
        options={{
          tabBarLabel: 'Yangi reys',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <PlusCircle size={focused ? 20 : 19} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
        options={{
          tabBarLabel: 'Faol reys',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Car size={focused ? 20 : 19} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Hamyon',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <Wallet size={focused ? 20 : 19} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          tabBarLabel: 'Hujjatlar',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
              <ShieldCheck size={focused ? 20 : 19} color={focused ? '#FF8800' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconCapsule: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCapsuleActive: {
    backgroundColor: 'rgba(255, 136, 0, 0.15)',
  },
});
