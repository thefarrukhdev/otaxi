import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name?: string;
  photoUrl?: string;
  source?: string;
  size?: AvatarSize;
  isVerified?: boolean;
  isOnline?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SIZE_CONFIG: Record<
  AvatarSize,
  {
    boxSize: number;
    fontSize: number;
    badgeSize: number;
    badgeIconSize: number;
    onlineDotSize: number;
  }
> = {
  xs: { boxSize: 28, fontSize: 11, badgeSize: 12, badgeIconSize: 8, onlineDotSize: 6 },
  sm: { boxSize: 36, fontSize: 13, badgeSize: 14, badgeIconSize: 10, onlineDotSize: 8 },
  md: { boxSize: 46, fontSize: 16, badgeSize: 16, badgeIconSize: 11, onlineDotSize: 10 },
  lg: { boxSize: 58, fontSize: 20, badgeSize: 18, badgeIconSize: 12, onlineDotSize: 12 },
  xl: { boxSize: 74, fontSize: 26, badgeSize: 22, badgeIconSize: 15, onlineDotSize: 14 },
};

const getInitials = (fullName?: string): string => {
  if (!fullName || !fullName.trim()) return '?';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = React.memo(
  ({
    name = '',
    photoUrl,
    source,
    size = 'md',
    isVerified = false,
    isOnline = false,
    style,
    testID,
  }) => {
    const [imageError, setImageError] = useState(false);
    const config = SIZE_CONFIG[size];
    const initials = getInitials(name);
    const imageUri = photoUrl || source;
    const showImage = Boolean(imageUri && !imageError);

    return (
      <View
        testID={testID}
        style={[
          styles.container,
          { width: config.boxSize, height: config.boxSize, borderRadius: config.boxSize / 2 },
          style,
        ]}
      >
        {showImage && imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: config.boxSize,
              height: config.boxSize,
              borderRadius: config.boxSize / 2,
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <View
            style={[
              styles.fallbackCircle,
              {
                width: config.boxSize,
                height: config.boxSize,
                borderRadius: config.boxSize / 2,
              },
            ]}
          >
            <Text
              style={[
                styles.initialsText,
                { fontSize: config.fontSize },
              ]}
            >
              {initials}
            </Text>
          </View>
        )}

        {/* Online Dot */}
        {isOnline && !isVerified && (
          <View
            style={[
              styles.onlineDot,
              {
                width: config.onlineDotSize,
                height: config.onlineDotSize,
                borderRadius: config.onlineDotSize / 2,
              },
            ]}
          />
        )}

        {/* Verified Badge */}
        {isVerified && (
          <View
            style={[
              styles.verifiedBadge,
              {
                width: config.badgeSize,
                height: config.badgeSize,
                borderRadius: config.badgeSize / 2,
              },
            ]}
          >
            <ShieldCheck size={config.badgeIconSize} color="#FFFFFF" strokeWidth={2.8} />
          </View>
        )}
      </View>
    );
  }
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#15171E',
    borderWidth: 1.5,
    borderColor: '#272B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackCircle: {
    backgroundColor: '#1D2029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontWeight: '800',
    color: '#FF8800',
    letterSpacing: -0.2,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0C0D11',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0C0D11',
  },
});
