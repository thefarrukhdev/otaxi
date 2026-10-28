import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../lib/theme';
import { Haptics } from '../ui/Haptics';
import { ArrowLeftRight, Car, UserCheck, ChevronLeft, Bell } from 'lucide-react-native';

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
          { paddingTop: Math.max(insets.top, 12) + 8 },
          isDriver ? styles.driverContainer : styles.passengerContainer,
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.brandContainer}>
            {showBackButton && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
                <ChevronLeft size={22} color={isDriver ? COLORS.white : COLORS.gray[800]} />
              </TouchableOpacity>
            )}
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>OTAXI</Text>
            </View>
            <View style={[styles.regionBadge, isDriver && styles.regionBadgeDriver]}>
              <Text style={[styles.regionBadgeText, isDriver && styles.regionBadgeTextDriver]}>
                {isDriver ? 'Driver Cockpit' : 'Central Asia'}
              </Text>
            </View>
          </View>

          <View style={styles.rightActionsRow}>
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
                  styles.modeToggle,
                  isDriver ? styles.modeToggleDriver : styles.modeTogglePassenger,
                ]}
                onPress={handleToggleMode}
                activeOpacity={0.8}
              >
                <ArrowLeftRight
                  size={13}
                  color={isDriver ? COLORS.amber[400] : COLORS.emerald[600]}
                />
                <Text
                  style={[
                    styles.modeToggleText,
                    isDriver ? styles.modeTextDriver : styles.modeTextPassenger,
                  ]}
                >
                  {isDriver ? 'Haydovchi' : 'Yo‘lovchi'}
                </Text>
                {isDriver ? (
                  <Car size={15} color={COLORS.amber[400]} />
                ) : (
                  <UserCheck size={15} color={COLORS.emerald[600]} />
                )}
              </TouchableOpacity>
            )}

            {rightAction}
          </View>
        </View>

        {(title || subtitle) && (
          <View style={styles.titleSection}>
            {title && (
              <Text style={[styles.title, isDriver && styles.titleDriver]}>{title}</Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, isDriver && styles.subtitleDriver]}>
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
  backButton: {
    marginRight: 4,
    padding: 2,
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
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  regionBadgeDriver: {
    backgroundColor: COLORS.navy[800],
    borderColor: COLORS.navy[700],
  },
  regionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[600],
  },
  regionBadgeTextDriver: {
    color: COLORS.amber[400],
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButtonDriver: {
    backgroundColor: COLORS.navy[800],
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.red[500],
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  modeTogglePassenger: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[300],
  },
  modeToggleDriver: {
    backgroundColor: COLORS.navy[800],
    borderColor: COLORS.amber[500],
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
    letterSpacing: -0.3,
  },
  titleDriver: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 3,
    lineHeight: 18,
  },
  subtitleDriver: {
    color: COLORS.navy[300],
  },
});
