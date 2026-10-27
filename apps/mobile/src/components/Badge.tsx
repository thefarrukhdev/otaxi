import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../lib/theme';

interface BadgeProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'blue' | 'red' | 'gray' | 'purple';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'emerald', icon, style }) => {
  const getColors = () => {
    switch (variant) {
      case 'amber':
        return { bg: COLORS.amber[50], border: COLORS.amber[200], text: COLORS.amber[800] };
      case 'blue':
        return { bg: COLORS.blue[50], border: COLORS.blue[100], text: COLORS.blue[700] };
      case 'red':
        return { bg: COLORS.red[50], border: COLORS.red[100], text: COLORS.red[700] };
      case 'gray':
        return { bg: COLORS.gray[100], border: COLORS.gray[200], text: COLORS.gray[700] };
      case 'purple':
        return { bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce' };
      case 'emerald':
      default:
        return { bg: COLORS.emerald[50], border: COLORS.emerald[200], text: COLORS.emerald[800] };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
