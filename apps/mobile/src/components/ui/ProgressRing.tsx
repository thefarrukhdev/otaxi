import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS } from '../../lib/theme';
import { useTheme } from '../../hooks/useTheme';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  centerText?: string;
  centerSubtext?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ProgressRing: React.FC<ProgressRingProps> = React.memo(
  ({
    progress,
    size = 80,
    strokeWidth = 7,
    color,
    trackColor,
    centerText,
    centerSubtext,
    children,
    style,
  }) => {
    const { isDriver } = useTheme();
    const clamped = Math.min(100, Math.max(0, progress));

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * clamped) / 100;

    const ringColor =
      color ||
      (clamped === 100
        ? COLORS.emerald[500]
        : clamped > 50
        ? isDriver
          ? COLORS.amber[500]
          : COLORS.emerald[600]
        : COLORS.amber[500]);

    const bgTrackColor =
      trackColor || (isDriver ? COLORS.navy[800] : COLORS.gray[200]);

    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Track Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={bgTrackColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        </Svg>

        <View style={styles.centerContent}>
          {children ? (
            children
          ) : (
            <>
              {centerText && (
                <Text style={[styles.centerText, isDriver && styles.centerTextDriver]}>
                  {centerText}
                </Text>
              )}
              {centerSubtext && (
                <Text style={[styles.centerSubtext, isDriver && styles.centerSubtextDriver]}>
                  {centerSubtext}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  centerTextDriver: {
    color: COLORS.white,
  },
  centerSubtext: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray[500],
    marginTop: 1,
  },
  centerSubtextDriver: {
    color: COLORS.navy[400],
  },
});
