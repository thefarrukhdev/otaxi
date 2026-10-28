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
            {showBackButton ? (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <ChevronLeft size={24} color={isDriver ? COLORS.white : '#0F172A'} />
              </TouchableOpacity>
            ) : null}

            <View style={styles.logoGroup}>
              <Text style={[styles.brandText, isDriver && styles.brandTextDriver]}>OTAXI</Text>
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
                <Bell size={18} color={isDriver ? COLORS.amber[400] : '#475569'} />
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
                    <User size={12} color={COLORS.amber[400]} />
                    <Text style={styles.modeTextDriver}>Yo‘lovchi</Text>
                  </>
                ) : (
                  <>
                    <Car size={13} color="#0F172A" />
                    <Text style={styles.modeTextPassenger}>Haydovchi</Text>
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
    paddingHorizontal: 18,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  passengerContainer: {
    backgroundColor: '#FFFFFF',
  },
  driverContainer: {
    backgroundColor: '#090D16',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    marginRight: 4,
    padding: 2,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  brandTextDriver: {
    color: COLORS.white,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modePillPassenger: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  modePillDriver: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  modeTextPassenger: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  modeTextDriver: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDriver: {
    backgroundColor: '#1E293B',
  },
  titleSection: {
    marginTop: 8,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
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
