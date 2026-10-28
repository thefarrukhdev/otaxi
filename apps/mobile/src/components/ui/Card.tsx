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
      const isDark = isDriver;

      switch (variant) {
        case 'elevated':
          return {
            backgroundColor: isDark ? COLORS.navy[900] : COLORS.white,
            borderColor: isDark ? COLORS.navy[800] : COLORS.gray[100],
            borderWidth: 1,
            ...(isDark ? SHADOWS.sm : SHADOWS.md),
          };
        case 'outlined':
          return {
            backgroundColor: isDark ? COLORS.navy[900] : COLORS.white,
            borderColor: isDark ? COLORS.navy[700] : COLORS.gray[200],
            borderWidth: 1.5,
          };
        case 'glass':
          return {
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.92)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            borderWidth: 1,
            backdropFilter: 'blur(10px)',
          } as ViewStyle;
        case 'surface':
        default:
          return {
            backgroundColor: isDark ? palette.surface : palette.surface,
            borderColor: palette.border,
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
