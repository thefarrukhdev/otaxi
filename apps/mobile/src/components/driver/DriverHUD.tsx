import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Haptics } from '../ui/Haptics';
import {
  Wallet,
  Star,
  ShieldCheck,
  TrendingUp,
  Car,
  ChevronRight,
} from 'lucide-react-native';

export interface DriverHUDProps {
  isOnline: boolean;
  onToggleOnline: (online: boolean) => void;
  balance: number;
  rating?: number;
  totalTrips?: number;
  onWalletPress?: () => void;
}

export const DriverHUD: React.FC<DriverHUDProps> = React.memo(
  ({
    isOnline,
    onToggleOnline,
    balance,
    rating = 4.95,
    totalTrips = 412,
    onWalletPress,
  }) => {
    const handleToggle = (value: boolean) => {
      Haptics.medium();
      onToggleOnline(value);
    };

    return (
      <View style={styles.container}>
        {/* Cockpit Status Bar with Toggle */}
        <View style={[styles.statusCard, isOnline ? styles.statusOnline : styles.statusOffline]}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? COLORS.emerald[400] : COLORS.gray[500] },
              ]}
            />
            <View>
              <Text style={styles.statusTitle}>
                {isOnline ? 'Safarga tayyorman (ONLAYN)' : 'Dam olish rejimi (OFLAYN)'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? 'Yo’lovchilar sizning reyslaringizni ko’rib, band qilishi mumkin'
                  : 'Yangi buyurtmalar vaqtinchalik to’xtatilgan'}
              </Text>
            </View>
          </View>

          <Switch
            value={isOnline}
            onValueChange={handleToggle}
            trackColor={{ false: COLORS.navy[700], true: COLORS.emerald[500] }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* HUD Quick Metrics Bar */}
        <View style={styles.metricsRow}>
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => {
              Haptics.selection();
              onWalletPress?.();
            }}
            activeOpacity={0.8}
          >
            <View style={styles.metricHeader}>
              <View style={styles.iconCircleAmber}>
                <Wallet size={16} color={COLORS.amber[400]} />
              </View>
              <Text style={styles.metricLabel}>Hamyon balansi</Text>
              <ChevronRight size={14} color={COLORS.navy[400]} />
            </View>
            <Text style={styles.metricValueAmber}>
              {balance.toLocaleString('uz-UZ')}{' '}
              <Text style={styles.currencyText}>UZS</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={styles.iconCircleEmerald}>
                <Star size={16} color={COLORS.emerald[400]} fill={COLORS.emerald[400]} />
              </View>
              <Text style={styles.metricLabel}>Haydovchi reytingi</Text>
            </View>
            <View style={styles.ratingValRow}>
              <Text style={styles.metricValueEmerald}>{rating.toFixed(2)}</Text>
              <Text style={styles.tripsCountText}>({totalTrips} safar)</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
);

DriverHUD.displayName = 'DriverHUD';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  statusOnline: {
    backgroundColor: COLORS.navy[900],
    borderColor: COLORS.emerald[500],
  },
  statusOffline: {
    backgroundColor: COLORS.navy[950],
    borderColor: COLORS.navy[800],
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  statusSubtitle: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
    lineHeight: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.navy[900],
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    ...SHADOWS.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  iconCircleAmber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleEmerald: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.navy[300],
    fontWeight: '600',
    flex: 1,
  },
  metricValueAmber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  currencyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amber[300],
  },
  ratingValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  metricValueEmerald: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.emerald[400],
  },
  tripsCountText: {
    fontSize: 11,
    color: COLORS.navy[400],
    fontWeight: '600',
  },
});
