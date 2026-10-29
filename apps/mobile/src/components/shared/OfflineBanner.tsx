import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../../lib/theme';
import { WifiOff, X, Compass } from 'lucide-react-native';

export interface OfflineBannerProps {
  isOffline?: boolean;
  message?: string;
  submessage?: string;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = React.memo(
  ({
    isOffline = true,
    message = 'Oflayn rejim: Tog’ dovoni / cho’l hududi',
    submessage = 'GPS koordinatalar mahalliy xotiraga saqlanmoqda. Aloqa tiklanganda sinxronlanadi.',
    onDismiss,
    style,
  }) => {
    const [dismissed, setDismissed] = useState(false);

    if (!isOffline || dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    return (
      <View style={[styles.container, style]}>
        <View style={styles.iconCircle}>
          <WifiOff size={16} color={COLORS.amber[400]} />
        </View>

        <View style={styles.textWrapper}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{message}</Text>
            <View style={styles.livePill}>
              <Compass size={11} color={COLORS.amber[300]} />
              <Text style={styles.livePillText}>GPS FAOL</Text>
            </View>
          </View>
          <Text style={styles.submessage} numberOfLines={2}>
            {submessage}
          </Text>
        </View>

        <TouchableOpacity onPress={handleDismiss} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={15} color={COLORS.navy[300]} />
        </TouchableOpacity>
      </View>
    );
  }
);

OfflineBanner.displayName = 'OfflineBanner';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy[900],
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.amber[500],
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amber[400],
    letterSpacing: 0.2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  livePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  submessage: {
    fontSize: 11,
    color: COLORS.navy[200],
    lineHeight: 15,
  },
  closeBtn: {
    padding: 6,
  },
});
