import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react-native';
import { Haptics } from './Haptics';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions | string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [toastData, setToastData] = useState<ToastOptions | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastData(null);
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const data: ToastOptions =
        typeof options === 'string'
          ? { message: options, type: 'info', duration: 2500 }
          : { duration: 2500, type: 'info', ...options };

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToastData(data);

      if (data.type === 'success') Haptics.success();
      else if (data.type === 'error') Haptics.error();
      else if (data.type === 'warning') Haptics.warning();
      else Haptics.light();

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          mass: 0.8,
          stiffness: 250,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        hideToast();
      }, data.duration || 2500);
    },
    [opacity, translateY, hideToast]
  );

  const renderIcon = (type?: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color="#10B981" />;
      case 'warning':
        return <AlertTriangle size={16} color="#FF8800" />;
      case 'error':
        return <XCircle size={16} color="#EF4444" />;
      case 'info':
      default:
        return <Info size={16} color="#60A5FA" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastData && (
        <Animated.View
          style={[
            styles.container,
            {
              top: Math.max(insets.top, 16) + 8,
              opacity,
              transform: [{ translateY }],
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={hideToast}
            style={[
              styles.toastPill,
              toastData.type === 'success' && styles.toastSuccess,
              toastData.type === 'warning' && styles.toastWarning,
              toastData.type === 'error' && styles.toastError,
            ]}
          >
            {renderIcon(toastData.type)}
            <Text style={styles.messageText}>{toastData.message}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1D2029',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    maxWidth: '100%',
  },
  toastSuccess: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: '#121A18',
  },
  toastWarning: {
    borderColor: 'rgba(255, 136, 0, 0.4)',
    backgroundColor: '#1A1813',
  },
  toastError: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: '#1F1416',
  },
  messageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
});
