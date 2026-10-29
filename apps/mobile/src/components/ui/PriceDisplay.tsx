import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

export type PriceDisplaySize = 'sm' | 'md' | 'lg' | 'xl';

export interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: PriceDisplaySize;
  oldAmount?: number;
  unit?: string;
  highlight?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SIZE_STYLES: Record<
  PriceDisplaySize,
  {
    amount: TextStyle;
    currency: TextStyle;
    oldAmount: TextStyle;
    unit: TextStyle;
  }
> = {
  sm: {
    amount: { fontSize: 14, fontWeight: '700' },
    currency: { fontSize: 10, fontWeight: '700' },
    oldAmount: { fontSize: 11 },
    unit: { fontSize: 11 },
  },
  md: {
    amount: { fontSize: 18, fontWeight: '800' },
    currency: { fontSize: 12, fontWeight: '700' },
    oldAmount: { fontSize: 13 },
    unit: { fontSize: 12 },
  },
  lg: {
    amount: { fontSize: 24, fontWeight: '800' },
    currency: { fontSize: 14, fontWeight: '700' },
    oldAmount: { fontSize: 15 },
    unit: { fontSize: 13 },
  },
  xl: {
    amount: { fontSize: 32, fontWeight: '900' },
    currency: { fontSize: 16, fontWeight: '800' },
    oldAmount: { fontSize: 17 },
    unit: { fontSize: 14 },
  },
};

export const PriceDisplay: React.FC<PriceDisplayProps> = React.memo(
  ({
    amount,
    currency = 'UZS',
    size = 'md',
    oldAmount,
    unit,
    highlight = false,
    style,
    testID,
  }) => {
    const typography = SIZE_STYLES[size];
    const formattedAmount = amount.toLocaleString('uz-UZ');

    return (
      <View testID={testID} style={[styles.container, style]}>
        {oldAmount && oldAmount > amount ? (
          <Text style={[styles.oldAmount, typography.oldAmount]}>
            {oldAmount.toLocaleString('uz-UZ')} {currency}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.amountText,
              typography.amount,
              highlight && styles.amountHighlight,
            ]}
          >
            {formattedAmount}
          </Text>
          <Text
            style={[
              styles.currencyText,
              typography.currency,
              highlight && styles.currencyHighlight,
            ]}
          >
            {currency}
          </Text>
          {unit ? <Text style={[styles.unitText, typography.unit]}>{unit}</Text> : null}
        </View>
      </View>
    );
  }
);

PriceDisplay.displayName = 'PriceDisplay';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  amountText: {
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  amountHighlight: {
    color: '#FF8800',
  },
  currencyText: {
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  currencyHighlight: {
    color: '#FF8800',
  },
  oldAmount: {
    color: '#64748B',
    textDecorationLine: 'line-through',
    fontVariant: ['tabular-nums'],
    marginBottom: 1,
  },
  unitText: {
    color: '#94A3B8',
    marginLeft: 2,
    fontWeight: '500',
  },
});
