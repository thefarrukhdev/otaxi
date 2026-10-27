import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../lib/theme';
import { ArrowLeftRight, Car, UserCheck, ShieldCheck } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showModeToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showModeToggle = true }) => {
  const insets = useSafeAreaInsets();
  const { userMode, toggleUserMode } = useApp();
  const isDriver = userMode === 'DRIVER';

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 12) + 8 },
        isDriver ? styles.driverContainer : styles.passengerContainer,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>OTAXI</Text>
          </View>
          <View style={styles.regionBadge}>
            <Text style={styles.regionBadgeText}>Central Asia</Text>
          </View>
        </View>

        {showModeToggle && (
          <TouchableOpacity
            style={[styles.modeToggle, isDriver ? styles.modeToggleDriver : styles.modeTogglePassenger]}
            onPress={toggleUserMode}
            activeOpacity={0.8}
          >
            <ArrowLeftRight size={14} color={isDriver ? COLORS.amber[500] : COLORS.emerald[600]} />
            <Text style={[styles.modeToggleText, isDriver ? styles.modeTextDriver : styles.modeTextPassenger]}>
              {isDriver ? 'Haydovchi rejimi' : 'Yo‘lovchi rejimi'}
            </Text>
            {isDriver ? (
              <Car size={16} color={COLORS.amber[500]} />
            ) : (
              <UserCheck size={16} color={COLORS.emerald[600]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {(title || subtitle) && (
        <View style={styles.titleSection}>
          {title && <Text style={[styles.title, isDriver && styles.titleDriver]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, isDriver && styles.subtitleDriver]}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  passengerContainer: {
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.gray[200],
  },
  driverContainer: {
    backgroundColor: COLORS.navy[900],
    borderBottomColor: COLORS.navy[800],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    backgroundColor: COLORS.emerald[600],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  logoText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  regionBadge: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  regionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    ...SHADOWS.sm,
  },
  modeTogglePassenger: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[200],
    borderWidth: 1,
  },
  modeToggleDriver: {
    backgroundColor: COLORS.navy[800],
    borderColor: COLORS.amber[500],
    borderWidth: 1,
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeTextPassenger: {
    color: COLORS.emerald[800],
  },
  modeTextDriver: {
    color: COLORS.amber[400],
  },
  titleSection: {
    marginTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  titleDriver: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  subtitleDriver: {
    color: COLORS.navy[300],
  },
});
