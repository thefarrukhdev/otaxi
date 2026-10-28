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
            bg: 'rgba(255, 136, 0, 0.15)',
            border: 'rgba(255, 136, 0, 0.4)',
            text: '#FF8800',
            dot: '#FF8800',
          };
        case 'info':
        case 'blue':
          return {
            bg: 'rgba(59, 130, 246, 0.15)',
            border: 'rgba(59, 130, 246, 0.35)',
            text: '#93C5FD',
            dot: '#60A5FA',
          };
        case 'danger':
        case 'red':
          return {
            bg: 'rgba(239, 68, 68, 0.15)',
            border: 'rgba(239, 68, 68, 0.35)',
            text: '#F87171',
            dot: '#EF4444',
          };
        case 'international':
        case 'purple':
          return {
            bg: 'rgba(139, 92, 246, 0.15)',
            border: 'rgba(139, 92, 246, 0.35)',
            text: '#C4B5FD',
            dot: '#A78BFA',
          };
        case 'neutral':
        case 'gray':
          return {
            bg: '#1D2029',
            border: '#272B35',
            text: '#94A3B8',
            dot: '#64748B',
          };
        case 'success':
        case 'emerald':
        default:
          return {
            bg: 'rgba(255, 136, 0, 0.12)',
            border: 'rgba(255, 136, 0, 0.35)',
            text: '#FF8800',
            dot: '#FF8800',
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
