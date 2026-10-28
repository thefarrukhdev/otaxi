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
  flag?: string; // e.g. 'KZ' | 'UZ' | 'KG' | 'TJ' or emoji directly
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const FLAG_MAP: Record<string, string> = {
  KZ: '🇰🇿',
  UZ: '🇺🇿',
  KG: '🇰🇬',
  TJ: '🇹🇯',
  TM: '🇹🇲',
};

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
        case 'warning':
        case 'amber':
          return {
            bg: COLORS.amber[50],
            border: COLORS.amber[200],
            text: COLORS.amber[800],
            dot: COLORS.amber[500],
          };
        case 'info':
        case 'blue':
          return {
            bg: COLORS.blue[50],
            border: COLORS.blue[200],
            text: COLORS.blue[700],
            dot: COLORS.blue[500],
          };
        case 'danger':
        case 'red':
          return {
            bg: COLORS.red[50],
            border: COLORS.red[200],
            text: COLORS.red[700],
            dot: COLORS.red[500],
          };
        case 'international':
        case 'purple':
          return {
            bg: '#F5F3FF',
            border: '#DDD6FE',
            text: '#6D28D9',
            dot: '#8B5CF6',
          };
        case 'neutral':
        case 'gray':
          return {
            bg: COLORS.gray[100],
            border: COLORS.gray[200],
            text: COLORS.gray[700],
            dot: COLORS.gray[400],
          };
        case 'success':
        case 'emerald':
        default:
          return {
            bg: COLORS.emerald[50],
            border: COLORS.emerald[200],
            text: COLORS.emerald[800],
            dot: COLORS.emerald[500],
          };
      }
    };

    const colors = getColors();
    const isMedium = size === 'md';
    const flagEmoji = flag ? FLAG_MAP[flag.toUpperCase()] || flag : null;

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
        {flagEmoji && <Text style={styles.flagText}>{flagEmoji}</Text>}
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
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  flagText: {
    fontSize: 12,
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
    fontSize: 13,
  },
});
