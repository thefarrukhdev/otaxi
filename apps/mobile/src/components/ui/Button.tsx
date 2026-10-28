import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../lib/theme';
import { Haptics } from './Haptics';

export type ButtonVariant = 'primary' | 'amber' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  haptic?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'none';
  testID?: string;
}

export const Button: React.FC<ButtonProps> = React.memo(
  ({
    title,
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    style,
    textStyle,
    haptic = 'selection',
    testID,
  }) => {
    const handlePress = () => {
      if (disabled || isLoading) return;

      if (haptic !== 'none') {
        switch (haptic) {
          case 'light':
            Haptics.light();
            break;
          case 'medium':
            Haptics.medium();
            break;
          case 'heavy':
            Haptics.heavy();
            break;
          case 'success':
            Haptics.success();
            break;
          case 'selection':
          default:
            Haptics.selection();
            break;
        }
      }

      onPress?.();
    };

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle; spinnerColor: string } => {
      switch (variant) {
        case 'amber':
          return {
            container: {
              backgroundColor: '#FF8800',
              borderColor: '#FF8800',
              borderWidth: 1,
            },
            text: { color: '#0C0D11', fontWeight: '800' },
            spinnerColor: '#0C0D11',
          };
        case 'secondary':
          return {
            container: {
              backgroundColor: '#1D2029',
              borderColor: '#272B35',
              borderWidth: 1,
            },
            text: { color: COLORS.white, fontWeight: '700' },
            spinnerColor: COLORS.white,
          };
        case 'outline':
          return {
            container: {
              backgroundColor: '#15171E',
              borderColor: '#272B35',
              borderWidth: 1.5,
            },
            text: { color: COLORS.white, fontWeight: '700' },
            spinnerColor: COLORS.white,
          };
        case 'ghost':
          return {
            container: {
              backgroundColor: COLORS.transparent,
              borderWidth: 0,
            },
            text: { color: '#FF8800', fontWeight: '700' },
            spinnerColor: '#FF8800',
          };
        case 'danger':
          return {
            container: {
              backgroundColor: COLORS.red[600],
              borderColor: COLORS.red[700],
              borderWidth: 1,
            },
            text: { color: COLORS.white, fontWeight: '700' },
            spinnerColor: COLORS.white,
          };
        case 'primary':
        default:
          return {
            container: {
              backgroundColor: '#FF8800',
              borderColor: '#FF8800',
              borderWidth: 1,
            },
            text: { color: '#0C0D11', fontWeight: '800' },
            spinnerColor: '#0C0D11',
          };
      }
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
      switch (size) {
        case 'sm':
          return {
            container: { height: 36, paddingHorizontal: 12, borderRadius: 8 },
            text: { fontSize: 13 },
          };
        case 'lg':
          return {
            container: { height: 56, paddingHorizontal: 24, borderRadius: 14 },
            text: { fontSize: 17 },
          };
        case 'md':
        default:
          return {
            container: { height: 48, paddingHorizontal: 18, borderRadius: 12 },
            text: { fontSize: 15 },
          };
      }
    };

    const variantStyle = getVariantStyles();
    const sizeStyle = getSizeStyles();

    return (
      <TouchableOpacity
        testID={testID}
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={disabled || isLoading}
        style={[
          styles.base,
          sizeStyle.container,
          variantStyle.container,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={variantStyle.spinnerColor} />
        ) : (
          <View style={styles.contentRow}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            {title ? (
              <Text style={[styles.baseText, sizeStyle.text, variantStyle.text, textStyle]}>
                {title}
              </Text>
            ) : (
              children
            )}
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
