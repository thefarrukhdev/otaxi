import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS } from '../../lib/theme';
import { useTheme } from '../../hooks/useTheme';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showPercent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({
    progress,
    height = 8,
    color,
    trackColor,
    label,
    showPercent = false,
    style,
  }) => {
    const { isDriver } = useTheme();
    const clampedProgress = Math.min(100, Math.max(0, progress));

    const fillColor =
      color ||
      (clampedProgress === 100
        ? COLORS.emerald[500]
        : clampedProgress > 40
        ? isDriver
          ? COLORS.amber[500]
          : COLORS.emerald[600]
        : COLORS.amber[500]);

    const bgTrackColor =
      trackColor || (isDriver ? COLORS.navy[800] : COLORS.gray[200]);

    return (
      <View style={[styles.container, style]}>
        {(label || showPercent) && (
          <View style={styles.labelRow}>
            {label ? (
              <Text style={[styles.labelText, isDriver && styles.labelTextDriver]}>{label}</Text>
            ) : <View />}
            {showPercent && (
              <Text style={[styles.percentText, isDriver && styles.percentTextDriver]}>
                {Math.round(clampedProgress)}%
              </Text>
            )}
          </View>
        )}

        <View style={[styles.track, { height, backgroundColor: bgTrackColor, borderRadius: height / 2 }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${clampedProgress}%`,
                height,
                backgroundColor: fillColor,
                borderRadius: height / 2,
              },
            ]}
          />
        </View>
      </View>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  labelTextDriver: {
    color: COLORS.navy[200],
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[800],
  },
  percentTextDriver: {
    color: COLORS.navy[100],
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
