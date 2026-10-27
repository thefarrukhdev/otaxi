import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../lib/theme';
import { useApp } from '../context/AppContext';
import { CreditCard, X, CheckCircle, ArrowDownCircle } from 'lucide-react-native';

interface PayoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({ visible, onClose }) => {
  const { driverBalance, requestPayout } = useApp();
  const [cardType, setCardType] = useState<'UZCARD' | 'HUMO' | 'KASPI'>('UZCARD');
  const [cardNumber, setCardNumber] = useState('8600123456789012');
  const [amountStr, setAmountStr] = useState('500000');

  const handlePayout = () => {
    const amount = parseInt(amountStr.replace(/\D/g, ''), 10);
    if (isNaN(amount) || amount < 50000) {
      Alert.alert('Xato', 'Minimal pul yechish miqdori 50,000 UZS.');
      return;
    }

    if (cardNumber.length < 16) {
      Alert.alert('Xato', 'Karta raqami kamida 16 ta raqamdan iborat bo’lishi shart.');
      return;
    }

    const res = requestPayout(cardNumber, amount);
    if (res.success) {
      Alert.alert('Muvaffaqiyatli', res.message, [
        {
          text: 'Tushunarli',
          onPress: onClose,
        },
      ]);
    } else {
      Alert.alert('Xato', res.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <ArrowDownCircle size={24} color={COLORS.emerald[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Pul yechib olish (Payout)</Text>
              <Text style={styles.subtitle}>
                Mavjud balans: {driverBalance.toLocaleString('uz-UZ')} UZS
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.gray[500]} />
            </TouchableOpacity>
          </View>

          {/* Card Type Selector */}
          <View style={styles.cardTypesRow}>
            {(['UZCARD', 'HUMO', 'KASPI'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeButton, cardType === type && styles.typeButtonActive]}
                onPress={() => {
                  setCardType(type);
                  if (type === 'UZCARD') setCardNumber('8600123456789012');
                  if (type === 'HUMO') setCardNumber('9860123456789012');
                  if (type === 'KASPI') setCardNumber('4400123456789012');
                }}
              >
                <Text style={[styles.typeText, cardType === type && styles.typeTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Card Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Karta raqami</Text>
            <View style={styles.cardInputWrapper}>
              <CreditCard size={18} color={COLORS.gray[400]} />
              <TextInput
                style={styles.cardInput}
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="8600 0000 0000 0000"
                keyboardType="number-pad"
                maxLength={16}
              />
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yechib olinadigan summa (UZS)</Text>
            <TextInput
              style={styles.amountInput}
              value={amountStr}
              onChangeText={setAmountStr}
              placeholder="500000"
              keyboardType="number-pad"
            />
          </View>

          {/* Quick presets */}
          <View style={styles.presetsRow}>
            {['100000', '300000', '500000', '1000000'].map((val) => (
              <TouchableOpacity
                key={val}
                style={styles.presetChip}
                onPress={() => setAmountStr(val)}
              >
                <Text style={styles.presetText}>{parseInt(val, 10).toLocaleString('uz-UZ')} so’m</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Commission Note */}
          <View style={styles.commissionBanner}>
            <CheckCircle size={16} color={COLORS.emerald[600]} />
            <Text style={styles.commissionText}>
              OTAXI platformasi haydovchilardan pul yechish uchun 0% komissiya oladi. Mablag’ 1-3 daqiqada tushadi.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handlePayout} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Yechib olishni tasdiqlash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.emerald[700],
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  cardTypesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  typeButtonActive: {
    backgroundColor: COLORS.emerald[600],
    borderColor: COLORS.emerald[700],
  },
  typeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gray[700],
  },
  typeTextActive: {
    color: COLORS.white,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 6,
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  cardInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  amountInput: {
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[600],
  },
  commissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emerald[50],
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
    gap: 8,
    marginBottom: 16,
  },
  commissionText: {
    fontSize: 11,
    color: COLORS.emerald[900],
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: COLORS.emerald[600],
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
