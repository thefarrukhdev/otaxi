import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { PayoutModal } from '../../components/PayoutModal';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  CheckCircle,
  Clock,
  ShieldCheck,
  History,
} from 'lucide-react-native';

export const WalletScreen: React.FC = () => {
  const { driverBalance, transactions } = useApp();
  const [isPayoutVisible, setPayoutVisible] = useState(false);

  // Weekly earnings bars mock
  const weekDays = [
    { day: 'Dush', amount: 280, height: '65%' },
    { day: 'Sesh', amount: 320, height: '75%' },
    { day: 'Chor', amount: 190, height: '45%' },
    { day: 'Pay', amount: 360, height: '85%' },
    { day: 'Jum', amount: 420, height: '100%' },
    { day: 'Shan', amount: 310, height: '72%' },
    { day: 'Yak', amount: 240, height: '55%' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Haydovchi Hamyoni" subtitle="Balans, daromadlar va to’lovlar tarixi" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Mavjud asosiy balans:</Text>
          <Text style={styles.balanceAmount}>
            {driverBalance.toLocaleString('uz-UZ')} <Text style={styles.currencyText}>UZS</Text>
          </Text>

          <View style={styles.balanceMetaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Yechib olishga tayyor:</Text>
              <Text style={styles.metaVal}>{driverBalance.toLocaleString('uz-UZ')} UZS</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Kafolat depoziti:</Text>
              <Text style={styles.metaVal}>100,000 UZS</Text>
            </View>
          </View>

          {/* Payout Action Button */}
          <TouchableOpacity
            style={styles.payoutButton}
            onPress={() => setPayoutVisible(true)}
            activeOpacity={0.85}
          >
            <ArrowDownCircle size={20} color={COLORS.navy[950]} />
            <Text style={styles.payoutButtonText}>Kartaga pul yechib olish (0% komissiya)</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Haftalik daromad dinamikasi</Text>
              <Text style={styles.chartSubtitle}>Jami: 2,120,000 UZS (Ushbu hafta)</Text>
            </View>
            <Badge label="+18% o’sish" variant="emerald" />
          </View>

          <View style={styles.barsContainer}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: item.height as any },
                      item.day === 'Jum' && styles.barFillHighest,
                    ]}
                  />
                </View>
                <Text style={styles.barDay}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionHeading}>Tranzaksiyalar tarixi</Text>
            <Text style={styles.historyCount}>{transactions.length} ta operatsiya</Text>
          </View>

          {transactions.map((tx) => {
            const isPositive = tx.amount > 0;
            return (
              <View key={tx.id} style={styles.txCard}>
                <View
                  style={[
                    styles.txIconBox,
                    isPositive ? styles.txIconPositive : styles.txIconNegative,
                  ]}
                >
                  {isPositive ? (
                    <ArrowUpRight size={18} color={COLORS.emerald[400]} />
                  ) : (
                    <ArrowDownCircle size={18} color={COLORS.amber[400]} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.txDesc}>{tx.description}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.txAmount,
                      isPositive ? styles.txAmountPositive : styles.txAmountNegative,
                    ]}
                  >
                    {isPositive ? '+' : ''}
                    {tx.amount.toLocaleString('uz-UZ')} UZS
                  </Text>
                  <Text style={styles.txStatus}>Bajarildi</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Payout Modal */}
      <PayoutModal visible={isPayoutVisible} onClose={() => setPayoutVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[950],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.navy[700],
    marginBottom: 16,
    ...SHADOWS.lg,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.navy[300],
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginVertical: 8,
  },
  currencyText: {
    fontSize: 20,
    color: COLORS.amber[400],
    fontWeight: '800',
  },
  balanceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navy[950],
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  metaCol: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.navy[400],
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  payoutButton: {
    backgroundColor: COLORS.amber[400],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...SHADOWS.md,
  },
  payoutButtonText: {
    color: COLORS.navy[950],
    fontSize: 14,
    fontWeight: '900',
  },
  chartCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  chartSubtitle: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: COLORS.navy[800],
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: COLORS.emerald[500],
    borderRadius: 7,
  },
  barFillHighest: {
    backgroundColor: COLORS.amber[400],
  },
  barDay: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.navy[400],
    marginTop: 6,
  },
  historySection: {
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[300],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyCount: {
    fontSize: 11,
    color: COLORS.navy[400],
    fontWeight: '600',
  },
  txCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconPositive: {
    backgroundColor: '#0a3322',
  },
  txIconNegative: {
    backgroundColor: '#3b2f15',
  },
  txDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  txDate: {
    fontSize: 11,
    color: COLORS.navy[400],
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  txAmountPositive: {
    color: COLORS.emerald[400],
  },
  txAmountNegative: {
    color: COLORS.amber[400],
  },
  txStatus: {
    fontSize: 10,
    color: COLORS.navy[400],
    marginTop: 2,
  },
});
