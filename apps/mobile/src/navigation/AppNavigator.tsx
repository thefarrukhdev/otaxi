import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { PassengerNavigator } from './PassengerNavigator';
import { DriverNavigator } from './DriverNavigator';

export const AppNavigator: React.FC = () => {
  const { userMode } = useApp();

  return (
    <NavigationContainer>
      {userMode === 'PASSENGER' ? <PassengerNavigator /> : <DriverNavigator />}
    </NavigationContainer>
  );
};
