import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { useApp } from '../../context/AppContext';
import { Haptics } from '../ui/Haptics';
import {
  CreditCard,
  X,
  ArrowDownCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react-native';

export interface PayoutModalProps {
  visible: boolean;
  onClose: () => void;
}

type CardType = 'UZCARD' | 'HUMO' | 'KASPI';

export const PayoutModal: React.FC<PayoutModalProps> = React.memo(({ visible, onClose }) => {
  const { driverBalance, requestPayout } = useApp();
  const [cardType, setCardType] = useState<CardType>('UZCARD');
  const [cardNumber, setCardNumber] = useState('8600 4812 9012 3456');
  const [amountStr, setAmountStr] = useState('500000');
  const [isLoading, setIsLoading] = useState(false);

  const presets = [100000, 250000, 500000, driverBalance];

  const handleSelectType = (type: CardType) => {
    Haptics.selection();
    setCardType(type);
    if (type === 'UZCARD') setCardNumber('8600 4812 9012 3456');
    if (type === 'HUMO') setCardNumber('9860 1234 5678 9012');
    if (type === 'KASPI') setCardNumber('4400 5511 2233 4455');
  };

  const handleSelectPreset = (val: number) => {
    Haptics.selection();
    setAmountStr(val.toString());
  };

  const formatCardInput = (text: string) => {
    const raw = text.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const parsedAmount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;
  const rawCard = cardNumber.replace(/\D/g, '');

  const handlePayout = () => {
    if (parsedAmount < 50000) {
      Haptics.warning();
      Alert.alert('Xato', 'Minimal yechib olish miqdori 50,000 UZS.');
      return;
    }

    if (parsedAmount > driverBalance) {
      Haptics.warning();
      Alert.alert(
        'Yetarli mablag’ yo’q',
        `Mavjud balans (${driverBalance.toLocaleString('uz-UZ')} UZS) kiritilgan summadan kam.`
      );
      return;
    }

    if (rawCard.length !== 16) {
      Haptics.warning();
      Alert.alert('Karta xatosi', 'Iltimos, 16 xonali karta raqamini to’liq kiriting.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = requestPayout(rawCard, parsedAmount);
      if (res.success) {
        Haptics.success();
        Alert.alert(
          'Pul muvaffaqiyatli yechildi!',
          `${parsedAmount.toLocaleString('uz-UZ')} UZS ${cardType} kartangizga 0% komissiya bilan o’tkazildi. Mablag’ 1-3 daqiqada balansingizga kelib tushadi.`,
          [
            {
              text: 'Ajoyib',
              onPress: onClose,
            },
          ]
        );
      } else {
        Haptics.error();
        Alert.alert('Xatolik', res.message);
      }
    }, 700);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <ArrowDownCircle size={22} color={COLORS.amber[400]} />
              </View>
              <View>
                <Text style={styles.title}>Kartaga pul yechish (Instant Payout)</Text>
                <Text style={styles.subtitle}>Bir zumda Uzcard, Humo yoki Kaspi kartalariga</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Current Balance Banner */}
            <View style={styles.balanceCard}>
              <View>
                <Text style={styles.balanceLabel}>Mavjud asosiy balans:</Text>
                <Text style={styles.balanceValue}>
                  {driverBalance.toLocaleString('uz-UZ')}{' '}
                  <Text style={styles.balanceCurrency}>UZS</Text>
                </Text>
              </View>
              <View style={styles.instantPill}>
                <Zap size={14} color={COLORS.amber[400]} />
                <Text style={styles.instantPillText}>Bir zumda</Text>
              </View>
            </View>

            {/* 0% Commission Promo Banner */}
            <View style={styles.promoBanner}>
              <View style={styles.promoIconBox}>
                <Sparkles size={16} color={COLORS.emerald[400]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>0% Komissiya • Maxsus Aksiya</Text>
                <Text style={styles.promoDesc}>
                  Haydovchilar uchun barcha kartalarga pul yechish to’liq bepul amalga oshiriladi.
                </Text>
              </View>
            </View>

            {/* Card Provider Selector Tabs */}
            <Text style={styles.sectionTitle}>To’lov kartasi turini tanlang</Text>
            <View style={styles.tabsRow}>
              {(['UZCARD', 'HUMO', 'KASPI'] as const).map((type) => {
                const isActive = cardType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                    onPress={() => handleSelectType(type)}
                    activeOpacity={0.8}
                  >
                    <CreditCard
                      size={14}
                      color={isActive ? COLORS.amber[400] : '#94A3B8'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                      {type === 'UZCARD' && 'Uzcard 🇺🇿'}
                      {type === 'HUMO' && 'Humo 🇺🇿'}
                      {type === 'KASPI' && 'Kaspi Gold 🇰🇿'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Card Number Input */}
            <Text style={styles.inputLabel}>16 xonali karta raqami</Text>
            <View style={styles.inputContainer}>
              <CreditCard size={18} color={COLORS.amber[400]} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                value={cardNumber}
                onChangeText={(text) => {
                  setCardNumber(formatCardInput(text));
                }}
                placeholder="8600 0000 0000 0000"
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            {/* Amount Input */}
            <Text style={styles.inputLabel}>Yechib olinadigan summa (UZS)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.amountInput]}
                value={parsedAmount > 0 ? parsedAmount.toLocaleString('uz-UZ') : ''}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  setAmountStr(cleaned);
                }}
                placeholder="50 000"
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
              />
              <Text style={styles.currencySuffix}>UZS</Text>
            </View>

            {/* Quick Amount Presets */}
            <View style={styles.presetsRow}>
              {presets.map((presetVal, idx) => {
                const isSelected = parsedAmount === presetVal;
                const isMax = idx === presets.length - 1;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => handleSelectPreset(presetVal)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                      {isMax ? 'Hammasi (Max)' : `${(presetVal / 1000).toLocaleString()}k`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Calculation Breakdown */}
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Yechib olinayotgan summa:</Text>
                <Text style={styles.breakdownValue}>{parsedAmount.toLocaleString('uz-UZ')} UZS</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>OTAXI komissiyasi (0% aksiya):</Text>
                <Text style={styles.breakdownFree}>0 UZS (Bepul)</Text>
              </View>
              <View style={[styles.breakdownRow, styles.breakdownTotalRow]}>
                <Text style={styles.breakdownTotalLabel}>Kartaga tushadigan sof summa:</Text>
                <Text style={styles.breakdownTotalValue}>
                  {parsedAmount.toLocaleString('uz-UZ')} UZS
                </Text>
              </View>
              <View style={styles.speedRow}>
                <Clock size={12} color={COLORS.emerald[400]} />
                <Text style={styles.speedText}>O’tkazma tezligi: Bir zumda (1-3 daqiqa)</Text>
              </View>
            </View>

            {/* Security Guarantee */}
            <View style={styles.securityRow}>
              <ShieldCheck size={14} color={COLORS.emerald[400]} />
              <Text style={styles.securityText}>
                PCI-DSS xalqaro xavfsizlik standarti va O’zbekiston Markaziy Banki litsenziyasi
              </Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handlePayout}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.navy[950]} />
              ) : (
                <>
                  <Zap size={18} color={COLORS.navy[950]} />
                  <Text style={styles.submitButtonText}>
                    {parsedAmount.toLocaleString('uz-UZ')} UZS yechib olish
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

PayoutModal.displayName = 'PayoutModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#111827', // Card Graphite
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: '#1F2937',
    maxHeight: '90%',
    paddingBottom: 28,
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#090D16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  balanceCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  instantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  instantPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 18,
  },
  promoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  promoDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#1E293B',
    borderColor: COLORS.amber[400],
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: COLORS.amber[400],
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
    padding: 0,
  },
  amountInput: {
    fontSize: 18,
    color: COLORS.amber[400],
  },
  currencySuffix: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    marginLeft: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: COLORS.amber[400],
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
    fontVariant: ['tabular-nums'],
  },
  presetTextActive: {
    color: COLORS.amber[400],
  },
  breakdownCard: {
    backgroundColor: '#090D16',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 14,
    gap: 8,
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  breakdownFree: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  breakdownTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    marginTop: 2,
  },
  breakdownTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  breakdownTotalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  speedText: {
    fontSize: 11,
    color: COLORS.emerald[400],
    fontWeight: '600',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  securityText: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.amber[400],
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
});
