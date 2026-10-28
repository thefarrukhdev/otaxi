import { useMemo, useCallback } from 'react';
import { ViewStyle } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS, THEME, TYPOGRAPHY } from '../lib/theme';
import { TripStatus, BookingStatus, VerificationStatus } from '@otaxi/types';

export interface StatusColorSet {
  bg: string;
  text: string;
  border: string;
}

/**
 * useTheme
 * 
 * Foydalanuvchi joriy rejimiga ('PASSENGER' vs 'DRIVER') qarab barcha
 * ranglar, stillar, palitra va yordamchi qulayliklarni taqdim etuvchi hook.
 */
export const useTheme = () => {
  const { userMode, setUserMode, toggleUserMode } = useApp();
  const isDriver = userMode === 'DRIVER';
  const isPassenger = userMode === 'PASSENGER';

  const palette = useMemo(() => {
    return isDriver ? THEME.driver : THEME.passenger;
  }, [isDriver]);

  const statusBarStyle = useMemo(() => {
    return isDriver ? ('light-content' as const) : ('dark-content' as const);
  }, [isDriver]);

  /**
   * Turli xil biznes statuslar (Reys, Bron, Verifikatsiya) uchun
   * mos ranglar to'plamini qaytaruvchi yordamchi funksiya.
   */
  const getStatusColor = useCallback((status: string): StatusColorSet => {
    switch (status) {
      // Yashil (Muvaffaqiyat, tasdiqlangan, faol)
      case TripStatus.PUBLISHED:
      case BookingStatus.CONFIRMED:
      case BookingStatus.COMPLETED:
      case VerificationStatus.APPROVED:
      case 'PAID':
      case 'COMPLETED':
      case 'SUCCESS':
        return {
          bg: COLORS.emerald[50],
          text: COLORS.emerald[700],
          border: COLORS.emerald[200],
        };

      // Sariq / Amber (Jarayonda, kutilmoqda, to'lov kutilmoqda)
      case TripStatus.IN_PROGRESS:
      case BookingStatus.PENDING_PAYMENT:
      case BookingStatus.IN_PROGRESS:
      case VerificationStatus.PENDING_REVIEW:
      case 'PENDING':
      case 'SCHEDULED':
      case 'AT_BORDER':
        return {
          bg: COLORS.amber[50],
          text: COLORS.amber[800],
          border: COLORS.amber[200],
        };

      // Qizil (Bekor qilingan, rad etilgan, muddati o'tgan)
      case TripStatus.CANCELLED:
      case BookingStatus.CANCELLED_BY_PASSENGER:
      case BookingStatus.CANCELLED_BY_DRIVER:
      case BookingStatus.EXPIRED:
      case VerificationStatus.REJECTED:
      case 'REJECTED':
      case 'FAILED':
        return {
          bg: COLORS.red[50],
          text: COLORS.red[700],
          border: COLORS.red[200],
        };

      // Moviy / Ko'k (To'lgan reys, tekshirilmagan)
      case TripStatus.FULL:
      case VerificationStatus.UNVERIFIED:
      case 'DEPARTED':
        return {
          bg: COLORS.blue[50],
          text: COLORS.blue[700],
          border: COLORS.blue[200],
        };

      // Kulrang (Qoralama, noma'lum)
      case TripStatus.DRAFT:
      default:
        return {
          bg: COLORS.gray[100],
          text: COLORS.gray[700],
          border: COLORS.gray[300],
        };
    }
  }, []);

  /**
   * Rejimga mos Card konteyner stillari
   */
  const getCardStyle = useCallback(
    (variant: 'surface' | 'surfaceSubtle' | 'elevated' | 'outline' = 'surface'): ViewStyle => {
      switch (variant) {
        case 'surfaceSubtle':
          return {
            backgroundColor: palette.surfaceSubtle,
            borderColor: palette.border,
            borderWidth: 1,
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderColor: palette.border,
            borderWidth: 1,
          };
        case 'elevated':
          return {
            backgroundColor: palette.card,
            borderColor: palette.border,
            borderWidth: isDriver ? 1 : 0,
            ...(isDriver ? {} : SHADOWS.md),
          };
        case 'surface':
        default:
          return {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            borderWidth: 1,
            ...(isDriver ? {} : SHADOWS.sm),
          };
      }
    },
    [palette, isDriver]
  );

  return {
    // Mode
    userMode,
    isDriver,
    isPassenger,
    setUserMode,
    toggleUserMode,

    // Base Design System
    palette,
    colors: COLORS,
    shadows: SHADOWS,
    typography: TYPOGRAPHY,

    // Shortcut Palette Tokens
    isDark: palette.isDark,
    background: palette.background,
    surface: palette.surface,
    surfaceSubtle: palette.surfaceSubtle,
    card: palette.card,
    text: palette.text,
    textMuted: palette.textMuted,
    textSubtle: palette.textSubtle,
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    primaryDark: palette.primaryDark,
    accent: palette.accent,
    border: palette.border,
    borderFocus: palette.borderFocus,

    // Status bar & Layout Helpers
    statusBarStyle,
    statusBarBg: palette.background,
    getStatusColor,
    getCardStyle,
  };
};

export default useTheme;
