import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS } from '../../lib/theme';
import { useCountdown } from '../../hooks/useCountdown';
import { Clock, AlertTriangle } from 'lucide-react-native';

export interface CountdownTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'pill' | 'card';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = React.memo(
  ({
    initialSeconds = 600, // 10 minutes
    onExpire,
    style,
    variant = 'pill',
  }) => {
    const { formattedTime, secondsLeft, isExpired } = useCountdown({
      initialSeconds,
      onExpire,
    });

    const isUrgent = secondsLeft < 120 && !isExpired; // Less than 2 minutes

    if (variant === 'card') {
      return (
        <View
          style={[
            styles.cardContainer,
            isUrgent && styles.cardUrgent,
            isExpired && styles.cardExpired,
            style,
          ]}
        >
          <View style={styles.cardHeader}>
            {isUrgent ? (
              <AlertTriangle size={18} color="#EF4444" />
            ) : (
              <Clock size={18} color="#FF8800" />
            )}
            <Text
              style={[
                styles.cardTitle,
                isUrgent && styles.textUrgent,
                isExpired && styles.textExpired,
              ]}
            >
              {isExpired ? 'Band qilish muddati tugadi' : 'O’rindiq band qilindi'}
            </Text>
          </View>
          <Text
            style={[
              styles.cardTimer,
              isUrgent && styles.textUrgent,
              isExpired && styles.textExpired,
            ]}
          >
            {formattedTime}
          </Text>
          <Text style={styles.cardHint}>
            {isExpired
              ? 'Joy boshqa yo’lovchilar uchun ochildi.'
              : 'Ushbu vaqt ichida to’lovni tasdiqlang, aks holda joy bekor qilinadi.'}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.pillContainer,
          isUrgent && styles.pillUrgent,
          isExpired && styles.pillExpired,
          style,
        ]}
      >
        {isUrgent ? (
          <AlertTriangle size={14} color="#EF4444" />
        ) : (
          <Clock size={14} color={isExpired ? '#64748B' : '#FF8800'} />
        )}
        <Text
          style={[
            styles.pillText,
            isUrgent && styles.textUrgent,
            isExpired && styles.textExpired,
          ]}
        >
          {isExpired ? 'Muddati o’tdi' : `Joy band: ${formattedTime}`}
        </Text>
      </View>
    );
  }
);

CountdownTimer.displayName = 'CountdownTimer';

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#251B10',
    borderWidth: 1,
    borderColor: '#593412',
    alignSelf: 'flex-start',
  },
  pillUrgent: {
    backgroundColor: '#281417',
    borderColor: '#661F25',
  },
  pillExpired: {
    backgroundColor: '#1D2029',
    borderColor: '#272B35',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFA033',
    fontVariant: ['tabular-nums'],
  },
  cardContainer: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
    alignItems: 'center',
  },
  cardUrgent: {
    borderColor: '#7F1D1D',
    backgroundColor: '#281417',
  },
  cardExpired: {
    borderColor: '#272B35',
    backgroundColor: '#15171E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardTimer: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
    marginVertical: 4,
  },
  cardHint: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  textUrgent: {
    color: '#F87171',
  },
  textExpired: {
    color: '#64748B',
  },
});
