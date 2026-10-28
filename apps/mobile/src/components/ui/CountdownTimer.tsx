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
              <AlertTriangle size={18} color={COLORS.red[600]} />
            ) : (
              <Clock size={18} color={COLORS.amber[600]} />
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
              : 'Ushbu vaqt ichida to’lovni amalga oshiring, aks holda joy bekor qilinadi.'}
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
          <AlertTriangle size={14} color={COLORS.red[600]} />
        ) : (
          <Clock size={14} color={isExpired ? COLORS.gray[500] : COLORS.amber[700]} />
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
    backgroundColor: COLORS.amber[50],
    borderWidth: 1,
    borderColor: COLORS.amber[200],
    alignSelf: 'flex-start',
  },
  pillUrgent: {
    backgroundColor: COLORS.red[50],
    borderColor: COLORS.red[200],
  },
  pillExpired: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[300],
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amber[900],
    fontVariant: ['tabular-nums'],
  },
  cardContainer: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.amber[50],
    borderWidth: 1,
    borderColor: COLORS.amber[200],
    alignItems: 'center',
  },
  cardUrgent: {
    backgroundColor: COLORS.red[50],
    borderColor: COLORS.red[200],
  },
  cardExpired: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[300],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.amber[900],
  },
  cardTimer: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.amber[900],
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
    marginVertical: 4,
  },
  cardHint: {
    fontSize: 11,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginTop: 2,
  },
  textUrgent: {
    color: COLORS.red[700],
  },
  textExpired: {
    color: COLORS.gray[500],
  },
});
