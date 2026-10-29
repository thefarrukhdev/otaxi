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
  Insets,
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
  accessibilityLabel?: string;
  accessibilityHint?: string;
  hitSlop?: Insets | number;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
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
      accessibilityLabel,
      accessibilityHint,
      hitSlop,
    },
    ref
  ) => {
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
        case 'secondary':
          return {
            container: styles.variantSecondary,
            text: styles.variantSecondaryText,
            spinnerColor: '#FFFFFF',
          };
        case 'outline':
          return {
            container: styles.variantOutline,
            text: styles.variantOutlineText,
            spinnerColor: '#FFFFFF',
          };
        case 'ghost':
          return {
            container: styles.variantGhost,
            text: styles.variantGhostText,
            spinnerColor: '#FF8800',
          };
        case 'danger':
          return {
            container: styles.variantDanger,
            text: styles.variantDangerText,
            spinnerColor: '#FFFFFF',
          };
        case 'amber':
        case 'primary':
        default:
          return {
            container: styles.variantPrimary,
            text: styles.variantPrimaryText,
            spinnerColor: '#0C0D11',
          };
      }
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
      switch (size) {
        case 'sm':
          return {
            container: styles.sizeSm,
            text: styles.sizeSmText,
          };
        case 'lg':
          return {
            container: styles.sizeLg,
            text: styles.sizeLgText,
          };
        case 'md':
        default:
          return {
            container: styles.sizeMd,
            text: styles.sizeMdText,
          };
      }
    };

    const variantStyle = getVariantStyles();
    const sizeStyle = getSizeStyles();
    const defaultHitSlop = size === 'sm' ? { top: 8, bottom: 8, left: 8, right: 8 } : undefined;
    const computedLabel =
      accessibilityLabel ||
      title ||
      (typeof children === 'string' ? children : undefined);

    const renderContent = () => {
      if (isLoading) {
        return <ActivityIndicator size="small" color={variantStyle.spinnerColor} />;
      }

      return (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          {title ? (
            <Text
              style={[styles.baseText, sizeStyle.text, variantStyle.text, textStyle]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : typeof children === 'string' ? (
            <Text
              style={[styles.baseText, sizeStyle.text, variantStyle.text, textStyle]}
              numberOfLines={1}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      );
    };

    return (
      <TouchableOpacity
        ref={ref as any}
        testID={testID}
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={disabled || isLoading}
        hitSlop={hitSlop || defaultHitSlop}
        accessibilityRole="button"
        accessibilityLabel={computedLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
        style={[
          styles.base,
          sizeStyle.container,
          variantStyle.container,
          fullWidth && styles.fullWidth,
          (disabled || isLoading) && styles.disabled,
          style,
        ]}
      >
        {renderContent()}
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
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
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
    letterSpacing: 0.1,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  // Sizes
  sizeSm: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  sizeSmText: {
    fontSize: 13,
  },
  sizeMd: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  sizeMdText: {
    fontSize: 15,
  },
  sizeLg: {
    height: 54,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  sizeLgText: {
    fontSize: 16,
  },
  // Variants
  variantPrimary: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
    borderWidth: 1,
  },
  variantPrimaryText: {
    color: '#0C0D11',
    fontWeight: '800',
  },
  variantSecondary: {
    backgroundColor: '#1D2029',
    borderColor: '#272B35',
    borderWidth: 1,
  },
  variantSecondaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  variantOutline: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
    borderWidth: 1.5,
  },
  variantOutlineText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  variantGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  variantGhostText: {
    color: '#FF8800',
    fontWeight: '700',
  },
  variantDanger: {
    backgroundColor: COLORS.red[600],
    borderColor: COLORS.red[700],
    borderWidth: 1,
  },
  variantDangerText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
