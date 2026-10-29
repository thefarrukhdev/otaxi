import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { COLORS } from '../../lib/theme';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'
  | 'international'
  | 'brand'
  // Backward compatibility aliases
  | 'emerald'
  | 'amber'
  | 'blue'
  | 'red'
  | 'gray'
  | 'purple';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  dot?: boolean;
  flag?: string; // e.g. 'KZ' | 'UZ' | 'KG' | 'TJ'
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Badge: React.FC<BadgeProps> = React.memo(
  ({
    label,
    variant = 'success',
    icon,
    dot = false,
    flag,
    size = 'sm',
    style,
    textStyle,
    testID,
  }) => {
    const getColors = () => {
      switch (variant) {
        case 'brand':
          return {
            bg: '#251B10',
            border: 'transparent',
            text: '#FF8800',
            dot: '#FF8800',
          };
        case 'warning':
        case 'amber':
          return {
            bg: '#251B10',
            border: 'transparent',
            text: '#FF8800',
            dot: '#FF8800',
          };
        case 'info':
        case 'blue':
          return {
            bg: '#121F33',
            border: 'transparent',
            text: '#60A5FA',
            dot: '#60A5FA',
          };
        case 'danger':
        case 'red':
          return {
            bg: '#281417',
            border: 'transparent',
            text: '#F87171',
            dot: '#EF4444',
          };
        case 'international':
        case 'purple':
          return {
            bg: '#201633',
            border: 'transparent',
            text: '#A78BFA',
            dot: '#A78BFA',
          };
        case 'neutral':
        case 'gray':
          return {
            bg: '#1C202A',
            border: 'transparent',
            text: '#94A3B8',
            dot: '#64748B',
          };
        case 'success':
        case 'emerald':
        default:
          return {
            bg: '#0F261C',
            border: 'transparent',
            text: '#10B981',
            dot: '#10B981',
          };
      }
    };

    const colors = getColors();
    const isMedium = size === 'md';

    return (
      <View
        testID={testID}
        style={[
          styles.badge,
          isMedium ? styles.badgeMd : styles.badgeSm,
          { backgroundColor: colors.bg, borderColor: colors.border },
          style,
        ]}
      >
        {dot && <View style={[styles.dot, { backgroundColor: colors.dot }]} />}
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.label,
            isMedium ? styles.labelMd : styles.labelSm,
            { color: colors.text },
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  flagText: {
    fontSize: 11,
  },
  icon: {
    marginRight: 2,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  labelSm: {
    fontSize: 11,
  },
  labelMd: {
    fontSize: 12,
  },
});
