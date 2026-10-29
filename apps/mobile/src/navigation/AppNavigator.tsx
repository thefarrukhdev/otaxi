import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { PassengerNavigator } from './PassengerNavigator';
import { DriverNavigator } from './DriverNavigator';

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0C0D11',
    card: '#15171E',
    text: '#FFFFFF',
    border: '#272B35',
    primary: '#FF8800',
  },
};

export const AppNavigator: React.FC = () => {
  const { userMode } = useApp();

  return (
    <NavigationContainer theme={DarkNavigationTheme}>
      {userMode === 'PASSENGER' ? <PassengerNavigator /> : <DriverNavigator />}
    </NavigationContainer>
  );
};
