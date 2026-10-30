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
import { PayoutModal } from '../../components/driver/PayoutModal';
import { useApp } from '../../context/AppContext';
import { Haptics } from '../../components/ui/Haptics';
import { Button, Card, Badge, PriceDisplay, SegmentedControl, EmptyState } from '../../components/ui';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  History,
  Zap,
  Percent,
} from 'lucide-react-native';

type FilterType = 'ALL' | 'EARNING' | 'PAYOUT' | 'COMMISSION';

export const WalletScreen: React.FC = () => {
  const { driverBalance, transactions } = useApp();
  const [isPayoutVisible, setPayoutVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');

  // Weekly earnings bars
  const weekDays = [
    { day: 'Dush', amount: 280000, height: '62%' },
    { day: 'Sesh', amount: 320000, height: '72%' },
    { day: 'Chor', amount: 190000, height: '44%' },
    { day: 'Pay', amount: 360000, height: '82%' },
    { day: 'Jum', amount: 420000, height: '100%', isPeak: true },
    { day: 'Shan', amount: 310000, height: '70%' },
    { day: 'Yak', amount: 240000, height: '54%' },
  ];

  const totalWeeklyEarnings = weekDays.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedFilter === 'ALL') return true;
    return tx.type === selectedFilter;
  });

  const handleOpenPayout = () => {
    Haptics.medium();
    setPayoutVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Haydovchi Hamyoni"
        subtitle="Daromadlar, to’lovlar va bir zumda pul yechish"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Main Balance Card */}
        <Card variant="surface" style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Mavjud asosiy balans:</Text>
              <PriceDisplay amount={driverBalance} currency="UZS" size="xl" />
            </View>
            <View style={styles.zeroFeeRow}>
              <Zap size={13} color="#FF8800" />
              <Text style={styles.zeroFeeText}>0% komissiya</Text>
            </View>
          </View>

          {/* Sub-Metrics Grid */}
          <View style={styles.balanceMetaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Yechib olishga tayyor:</Text>
              <PriceDisplay amount={driverBalance} currency="UZS" size="sm" />
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Bugungi sof tushum:</Text>
              <PriceDisplay amount={324000} currency="UZS" size="sm" />
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Kafolat depoziti:</Text>
              <PriceDisplay amount={100000} currency="UZS" size="sm" />
            </View>
          </View>

          {/* Payout Action Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Zap size={18} color="#0C0D11" />}
            title="Kartaga pul yechib olish (Instant Payout)"
            onPress={handleOpenPayout}
          />
        </Card>

        {/* Weekly Chart */}
        <Card variant="surface" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Haftalik daromad dinamikasi</Text>
              <Text style={styles.chartSubtitle}>
                Jami:{' '}
                <Text style={styles.chartSumHighlight}>
                  {totalWeeklyEarnings.toLocaleString('uz-UZ')} UZS
                </Text>{' '}
                (Ushbu hafta)
              </Text>
            </View>
            <Text style={styles.growthText}>+18% o’sish</Text>
          </View>

          {/* Bar Chart Visualization */}
          <View style={styles.barsContainer}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.barCol}>
                <Text style={styles.barAmountText}>
                  {Math.round(item.amount / 1000)}k
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: item.height as any },
                      item.isPeak && styles.barFillHighest,
                    ]}
                  />
                </View>
                <Text style={[styles.barDay, item.isPeak && styles.barDayPeak]}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Transactions History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View style={styles.historyTitleRow}>
              <History size={16} color={COLORS.amber[400]} />
              <Text style={styles.sectionHeading}>Tranzaksiyalar tarixi</Text>
            </View>
            <Text style={styles.historyCount}>{filteredTransactions.length} ta operatsiya</Text>
          </View>

          {/* Filter Tabs */}
          <SegmentedControl
            size="sm"
            items={[
              { id: 'ALL', label: 'Barchasi' },
              { id: 'EARNING', label: 'Tushumlar' },
              { id: 'PAYOUT', label: 'Yechilgan' },
              { id: 'COMMISSION', label: 'Komissiya' },
            ]}
            selectedId={selectedFilter}
            onSelect={(id) => setSelectedFilter(id as FilterType)}
            style={{ marginBottom: 14 }}
          />

          {/* Transaction List */}
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon={<Wallet size={32} color="#FF8800" />}
              title="Tranzaksiyalar mavjud emas"
              description="Tanlangan toifada hozircha operatsiyalar amalga oshirilmagan."
            />
          ) : (
            <View style={styles.txList}>
              {filteredTransactions.map((tx) => {
                const isEarning = tx.type === 'EARNING';
                const isPayout = tx.type === 'PAYOUT';
                const isCommission = tx.type === 'COMMISSION';

                return (
                  <Card key={tx.id} variant="surface" style={styles.txCard}>
                    <View
                      style={[
                        styles.txIconBox,
                        isEarning && styles.txIconBoxEarning,
                        isPayout && styles.txIconBoxPayout,
                        isCommission && styles.txIconBoxCommission,
                      ]}
                    >
                      {isEarning && <ArrowUpRight size={18} color={COLORS.emerald[400]} />}
                      {isPayout && <ArrowDownCircle size={18} color="#FF8800" />}
                      {isCommission && <Percent size={16} color="#94A3B8" />}
                    </View>

                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.txDesc}>{tx.description}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={[
                          styles.txAmount,
                          isEarning && styles.txAmountPositive,
                          isPayout && styles.txAmountPayout,
                          isCommission && styles.txAmountCommission,
                        ]}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount.toLocaleString('uz-UZ')} UZS
                      </Text>
                      <View style={styles.txStatusPill}>
                        <CheckCircle2 size={10} color={COLORS.emerald[400]} />
                        <Text style={styles.txStatusText}>Bajarildi</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
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
    backgroundColor: '#0C0D11',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: '#15171E',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#272B35',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.amber[400],
    marginTop: 2,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#94A3B8',
  },
  zeroFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zeroFeeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF8800',
  },
  balanceMetaRow: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#272B35',
    marginBottom: 16,
    gap: 8,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  payoutButton: {
    backgroundColor: COLORS.amber[400],
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.md,
  },
  payoutButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
  chartCard: {
    backgroundColor: '#15171E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#272B35',
    marginBottom: 18,
    ...SHADOWS.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  chartSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  chartSumHighlight: {
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  growthText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barAmountText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    width: 24,
    height: 90,
    backgroundColor: '#090D16',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  barFillHighest: {
    backgroundColor: COLORS.amber[400],
  },
  barDay: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 6,
  },
  barDayPeak: {
    color: COLORS.amber[400],
    fontWeight: '800',
  },
  historySection: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    flex: 1,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#1E293B',
    borderColor: COLORS.amber[400],
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterChipTextActive: {
    color: COLORS.amber[400],
  },
  txList: {
    gap: 10,
  },
  txCard: {
    backgroundColor: '#15171E',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#272B35',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.sm,
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconBoxEarning: {
    backgroundColor: '#0D2818',
  },
  txIconBoxPayout: {
    backgroundColor: '#2A1805',
  },
  txIconBoxCommission: {
    backgroundColor: '#1F2430',
  },
  txDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  txDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  txAmountPositive: {
    color: COLORS.emerald[400],
  },
  txAmountPayout: {
    color: COLORS.amber[400],
  },
  txAmountCommission: {
    color: '#94A3B8',
  },
  txStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  txStatusText: {
    fontSize: 10,
    color: COLORS.emerald[400],
    fontWeight: '600',
  },
});
