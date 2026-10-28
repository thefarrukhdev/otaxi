import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { useTheme } from '../../hooks/useTheme';
import { Haptics } from './Haptics';

export type CardVariant = 'surface' | 'elevated' | 'outlined' | 'glass';

export interface CardProps {
  children?: React.ReactNode;
  variant?: CardVariant;
  pressable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'selection' | 'none';
  testID?: string;
}

export const Card: React.FC<CardProps> = React.memo(
  ({
    children,
    variant = 'surface',
    pressable = false,
    onPress,
    style,
    contentStyle,
    haptic = 'selection',
    testID,
  }) => {
    const { isDriver, palette } = useTheme();

    const getVariantStyles = (): ViewStyle => {
      switch (variant) {
        case 'elevated':
          return {
            backgroundColor: '#1D2029',
            borderColor: '#272B35',
            borderWidth: 1,
            ...SHADOWS.sm,
          };
        case 'outlined':
          return {
            backgroundColor: '#15171E',
            borderColor: '#272B35',
            borderWidth: 1.5,
          };
        case 'glass':
          return {
            backgroundColor: 'rgba(21, 23, 30, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            backdropFilter: 'blur(10px)',
          } as ViewStyle;
        case 'surface':
        default:
          return {
            backgroundColor: '#15171E',
            borderColor: '#272B35',
            borderWidth: 1,
            ...SHADOWS.sm,
          };
      }
    };

    const handlePress = () => {
      if (!onPress) return;
      if (haptic === 'light') Haptics.light();
      else if (haptic === 'selection') Haptics.selection();
      onPress();
    };

    const isInteractive = pressable || Boolean(onPress);
    const combinedStyles = [styles.card, getVariantStyles(), style];

    if (isInteractive) {
      return (
        <TouchableOpacity
          testID={testID}
          activeOpacity={0.85}
          onPress={handlePress}
          style={combinedStyles}
        >
          <View style={contentStyle}>{children}</View>
        </TouchableOpacity>
      );
    }

    return (
      <View testID={testID} style={combinedStyles}>
        <View style={contentStyle}>{children}</View>
      </View>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
});
