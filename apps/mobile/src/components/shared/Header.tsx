import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../lib/theme';
import { Haptics } from '../ui/Haptics';
import { ChevronLeft, Bell, Car, User, Compass, ArrowLeftRight } from 'lucide-react-native';

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
        ]}
      >
        <View style={styles.topRow}>
          {/* Brand Left Section: (O) TAXI in User's Style */}
          <View style={styles.brandRow}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Orqaga qaytish"
              >
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : null}

            <View style={styles.logoGroup}>
              {/* Orange Steering Wheel Icon as seen in screenshot */}
              <View style={styles.logoIcon}>
                <View style={styles.logoIconInner}>
                  <Compass size={13} color="#FF8800" strokeWidth={2.8} />
                </View>
              </View>
              <Text style={styles.brandWord}>TAXI</Text>
            </View>
          </View>

          {/* Right Actions */}
          <View style={styles.actionsRow}>
            {showNotification && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Bell size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}

            {showModeToggle && (
              <TouchableOpacity
                style={styles.modePill}
                onPress={handleToggleMode}
                activeOpacity={0.8}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessibilityRole="button"
                accessibilityLabel={
                  isDriver ? "Yo'lovchi rejimiga o'tish" : "Haydovchi rejimiga o'tish"
                }
              >
                {isDriver ? (
                  <>
                    <User size={12} color="#FF8800" />
                    <Text style={styles.modeTextActive}>Yo‘lovchi</Text>
                  </>
                ) : (
                  <>
                    <Car size={13} color="#FF8800" />
                    <Text style={styles.modeTextActive}>Haydovchi</Text>
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
            {title && <Text style={styles.titleText}>{title}</Text>}
            {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
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
    paddingBottom: 10,
    backgroundColor: '#0C0D11',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1C24',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
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
    gap: 7,
  },
  logoIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#251B10',
    borderWidth: 1.5,
    borderColor: '#FF8800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandWord: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
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
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  modeTextActive: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginTop: 10,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
});
