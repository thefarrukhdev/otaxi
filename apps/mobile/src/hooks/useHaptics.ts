import { useCallback, useMemo } from 'react';
import { Platform, Vibration } from 'react-native';

export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Haptics static utility object.
 * Safe on iOS, Android and Web with graceful vibration fallbacks.
 */
export const Haptics = {
  light: () => {
    if (Platform.OS === 'web') return;
    try {
      // Dynamic import to prevent crash if native module isn't linked
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.impactAsync) {
        ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(10);
    }
  },

  medium: () => {
    if (Platform.OS === 'web') return;
    try {
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.impactAsync) {
        ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(25);
    }
  },

  heavy: () => {
    if (Platform.OS === 'web') return;
    try {
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.impactAsync) {
        ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(45);
    }
  },

  selection: () => {
    if (Platform.OS === 'web') return;
    try {
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.selectionAsync) {
        ExpoHaptics.selectionAsync();
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(8);
    }
  },

  success: () => {
    if (Platform.OS === 'web') return;
    try {
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.notificationAsync) {
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 15, 60, 25]);
    }
  },

  warning: () => {
    if (Platform.OS === 'web') return;
    try {
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.notificationAsync) {
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 30, 40, 30]);
    }
  },

  error: () => {
    if (Platform.OS === 'web') return;
    try {
      const ExpoHaptics = require('expo-haptics');
      if (ExpoHaptics?.notificationAsync) {
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
        return;
      }
    } catch {
      // fallback
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 40, 60, 40]);
    }
  },

  trigger: (type: HapticFeedbackType) => {
    switch (type) {
      case 'light':
        return Haptics.light();
      case 'medium':
        return Haptics.medium();
      case 'heavy':
        return Haptics.heavy();
      case 'selection':
        return Haptics.selection();
      case 'success':
        return Haptics.success();
      case 'warning':
        return Haptics.warning();
      case 'error':
        return Haptics.error();
    }
  },
};

/**
 * useHaptics
 * 
 * Tugmalar bosilganda, o'rindiq tanlanganda va amallar bajarilganda
 * mayin tebranish (haptic feedback) beruvchi React hook.
 * iOS/Android native va Web platformalari uchun 100% xavfsiz.
 */
export const useHaptics = () => {
  const light = useCallback(() => Haptics.light(), []);
  const medium = useCallback(() => Haptics.medium(), []);
  const heavy = useCallback(() => Haptics.heavy(), []);
  const selection = useCallback(() => Haptics.selection(), []);
  const success = useCallback(() => Haptics.success(), []);
  const warning = useCallback(() => Haptics.warning(), []);
  const error = useCallback(() => Haptics.error(), []);
  const trigger = useCallback((type: HapticFeedbackType) => Haptics.trigger(type), []);

  // Semantic UI event handlers
  const onSelectSeat = useCallback(() => Haptics.selection(), []);
  const onButtonPress = useCallback(() => Haptics.light(), []);
  const onTabChange = useCallback(() => Haptics.selection(), []);
  const onActionConfirmed = useCallback(() => Haptics.success(), []);
  const onActionFailed = useCallback(() => Haptics.error(), []);

  return useMemo(
    () => ({
      // Direct methods
      light,
      medium,
      heavy,
      selection,
      success,
      warning,
      error,
      trigger,

      // Semantic actions
      onSelectSeat,
      onButtonPress,
      onTabChange,
      onActionConfirmed,
      onActionFailed,

      // Raw object reference
      Haptics,
    }),
    [
      light,
      medium,
      heavy,
      selection,
      success,
      warning,
      error,
      trigger,
      onSelectSeat,
      onButtonPress,
      onTabChange,
      onActionConfirmed,
      onActionFailed,
    ]
  );
};

export default useHaptics;
