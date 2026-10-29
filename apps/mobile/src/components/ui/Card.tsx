import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SHADOWS } from '../../lib/theme';
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
  accessibilityLabel?: string;
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
    accessibilityLabel,
  }) => {
    const handlePress = () => {
      if (!onPress) return;
      if (haptic === 'light') Haptics.light();
      else if (haptic === 'selection') Haptics.selection();
      onPress();
    };

    const isInteractive = pressable || Boolean(onPress);

    const variantStyle =
      variant === 'elevated'
        ? styles.elevated
        : variant === 'outlined'
        ? styles.outlined
        : variant === 'glass'
        ? styles.glass
        : styles.surface;

    const combinedStyles = [styles.card, variantStyle, style];

    const body = contentStyle ? <View style={contentStyle}>{children}</View> : children;

    if (isInteractive) {
      return (
        <TouchableOpacity
          testID={testID}
          activeOpacity={0.85}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={combinedStyles}
        >
          {body}
        </TouchableOpacity>
      );
    }

    return (
      <View testID={testID} style={combinedStyles} accessibilityLabel={accessibilityLabel}>
        {body}
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
  surface: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  elevated: {
    backgroundColor: '#1D2029',
    borderColor: '#272B35',
    borderWidth: 1,
    ...SHADOWS.md,
  },
  outlined: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
    borderWidth: 1.5,
  },
  glass: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
    borderWidth: 1,
    ...SHADOWS.sm,
  },
});
