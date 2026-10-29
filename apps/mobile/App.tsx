import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { ToastProvider } from './src/components/ui';
import { AppNavigator } from './src/navigation/AppNavigator';

const AppContent: React.FC = () => {
  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor="#0C0D11" />
      <AppNavigator />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0D11',
  },
});
