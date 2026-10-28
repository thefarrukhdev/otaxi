import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../lib/theme';
import { Haptics } from '../ui/Haptics';
import { ChevronLeft, Bell, Car, ArrowLeftRight, User } from 'lucide-react-native';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showModeToggle?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({
    title,
    subtitle,
    showModeToggle = true,
    showBackButton = false,
    onBack,
    showNotification = false,
    onNotificationPress,
    rightAction,
  }) => {
    const insets = useSafeAreaInsets();
    const { userMode, toggleUserMode } = useApp();
    const isDriver = userMode === 'DRIVER';

    const handleToggleMode = () => {
      Haptics.medium();
      toggleUserMode();
    };

    const handleBack = () => {
      Haptics.light();
      onBack?.();
    };

    return (
      <View
        style={[
          styles.container,
          { paddingTop: Math.max(insets.top, 12) + 6 },
          isDriver ? styles.driverContainer : styles.passengerContainer,
        ]}
      >
        <View style={styles.topRow}>
          {/* Brand Left Section */}
          <View style={styles.brandRow}>
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <ChevronLeft size={24} color={isDriver ? COLORS.white : COLORS.gray[900]} />
              </TouchableOpacity>
            )}

            <View style={styles.logoGroup}>
              <Text style={[styles.brandText, isDriver && styles.brandTextDriver]}>OTAXI</Text>
              <View style={[styles.regionBadge, isDriver && styles.regionBadgeDriver]}>
                <Text style={[styles.regionBadgeText, isDriver && styles.regionBadgeTextDriver]}>
                  {isDriver ? 'Cockpit' : 'Central Asia'}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Actions */}
          <View style={styles.actionsRow}>
            {showNotification && (
              <TouchableOpacity
                style={[styles.iconButton, isDriver && styles.iconButtonDriver]}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Bell size={18} color={isDriver ? COLORS.amber[400] : COLORS.gray[700]} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            )}

            {showModeToggle && (
              <TouchableOpacity
                style={[
                  styles.modePill,
                  isDriver ? styles.modePillDriver : styles.modePillPassenger,
                ]}
                onPress={handleToggleMode}
                activeOpacity={0.8}
              >
                {isDriver ? (
                  <>
                    <User size={13} color={COLORS.amber[400]} />
                    <Text style={styles.modeTextDriver}>Yo‘lovchi</Text>
                    <ArrowLeftRight size={11} color={COLORS.amber[400]} style={{ opacity: 0.8 }} />
                  </>
                ) : (
                  <>
                    <Car size={14} color={COLORS.emerald[700]} />
                    <Text style={styles.modeTextPassenger}>Haydovchi</Text>
                    <ArrowLeftRight size={11} color={COLORS.emerald[600]} style={{ opacity: 0.7 }} />
                  </>
                )}
              </TouchableOpacity>
            )}

            {rightAction}
          </View>
        </View>

        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <View style={styles.titleSection}>
            {title && (
              <Text style={[styles.titleText, isDriver && styles.titleTextDriver]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitleText, isDriver && styles.subtitleTextDriver]}>
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
);

Header.displayName = 'Header';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  passengerContainer: {
    backgroundColor: COLORS.white,
    borderBottomColor: '#F1F5F9',
  },
  driverContainer: {
    backgroundColor: '#090D16',
    borderBottomColor: '#1F2937',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    paddingRight: 4,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandTextDriver: {
    color: COLORS.white,
  },
  regionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  regionBadgeDriver: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  regionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.2,
  },
  regionBadgeTextDriver: {
    color: COLORS.amber[400],
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1.2,
  },
  modePillPassenger: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  modePillDriver: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  modeTextPassenger: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  modeTextDriver: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButtonDriver: {
    backgroundColor: '#1E293B',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.red[500],
  },
  titleSection: {
    marginTop: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  titleTextDriver: {
    color: COLORS.white,
  },
  subtitleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  subtitleTextDriver: {
    color: '#94A3B8',
  },
});
