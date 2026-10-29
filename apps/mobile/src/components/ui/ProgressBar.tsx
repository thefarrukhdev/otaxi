import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';

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
    height = 6,
    color = '#FF8800',
    trackColor = '#272B35',
    label,
    showPercent = false,
    style,
  }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const isCompleted = clampedProgress === 100;
    const barColor = isCompleted ? '#10B981' : color;

    return (
      <View
        style={[styles.container, style]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}
      >
        {(label || showPercent) && (
          <View style={styles.labelRow}>
            {label ? <Text style={styles.labelText}>{label}</Text> : <View />}
            {showPercent && (
              <Text style={styles.percentText}>{Math.round(clampedProgress)}%</Text>
            )}
          </View>
        )}

        <View
          style={[
            styles.track,
            { height, backgroundColor: trackColor, borderRadius: height / 2 },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${clampedProgress}%`,
                height,
                backgroundColor: barColor,
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
    color: '#CBD5E1',
    letterSpacing: 0.1,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
