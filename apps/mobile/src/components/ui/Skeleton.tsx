import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  StyleProp,
  DimensionValue,
} from 'react-native';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> & {
  Avatar: React.FC<{ size?: number; style?: StyleProp<ViewStyle> }>;
  Line: React.FC<{ width?: DimensionValue; height?: number; style?: StyleProp<ViewStyle> }>;
  TripCard: React.FC<{ style?: StyleProp<ViewStyle> }>;
} = ({ width = '100%', height = 16, borderRadius = 6, style }) => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.75,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

// Preset: Circle Avatar Skeleton
Skeleton.Avatar = ({ size = 46, style }) => (
  <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />
);
Skeleton.Avatar.displayName = 'Skeleton.Avatar';

// Preset: Text Line Skeleton
Skeleton.Line = ({ width = '100%', height = 14, style }) => (
  <Skeleton width={width} height={height} borderRadius={4} style={style} />
);
Skeleton.Line.displayName = 'Skeleton.Line';

// Preset: TripCard Skeleton
Skeleton.TripCard = ({ style }) => (
  <View style={[styles.cardContainer, style]}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="55%" height={17} borderRadius={4} />
        <Skeleton width="35%" height={12} borderRadius={4} />
      </View>
      <Skeleton width={70} height={20} borderRadius={6} />
    </View>

    <View style={styles.cardDivider} />

    <View style={styles.cardFooter}>
      <Skeleton width={80} height={14} borderRadius={4} />
      <Skeleton width={90} height={14} borderRadius={4} />
    </View>
  </View>
);
Skeleton.TripCard.displayName = 'Skeleton.TripCard';

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#272B35',
  },
  cardContainer: {
    backgroundColor: '#15171E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#1E212B',
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
