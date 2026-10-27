import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS, SHADOWS } from '../lib/theme';
import { useApp } from '../context/AppContext';
import { UserCheck, X, CheckCircle, AlertCircle } from 'lucide-react-native';

interface PassengerCodeVerifyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PassengerCodeVerifyModal: React.FC<PassengerCodeVerifyModalProps> = ({
  visible,
  onClose,
}) => {
  const { verifyPassengerCode } = useApp();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleVerify = () => {
    if (code.trim().length !== 4) {
      Alert.alert('Xato', 'Iltimos, yo’lovchining 4 xonali tasdiqlash kodini to’liq kiriting.');
      return;
    }

    const res = verifyPassengerCode(code.trim());
    setResult(res);

    if (res.success) {
      setTimeout(() => {
        setCode('');
        setResult(null);
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setCode('');
    setResult(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <UserCheck size={22} color={COLORS.emerald[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Yo’lovchini bortga olish</Text>
              <Text style={styles.subtitle}>4 xonali tasdiqlash kodini kiriting</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.gray[500]} />
            </TouchableOpacity>
          </View>

          {/* Input Field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="Masalan: 4892"
              placeholderTextColor={COLORS.gray[400]}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
            />
          </View>

          {/* Feedback message */}
          {result && (
            <View
              style={[
                styles.feedbackBox,
                result.success ? styles.feedbackSuccess : styles.feedbackError,
              ]}
            >
              {result.success ? (
                <CheckCircle size={18} color={COLORS.emerald[700]} />
              ) : (
                <AlertCircle size={18} color={COLORS.red[700]} />
              )}
              <Text
                style={[
                  styles.feedbackText,
                  result.success ? styles.feedbackTextSuccess : styles.feedbackTextError,
                ]}
              >
                {result.message}
              </Text>
            </View>
          )}

          {/* Quick Demo Hints */}
          <View style={styles.hintSection}>
            <Text style={styles.hintHeading}>Test yo’lovchilar kodlari:</Text>
            <View style={styles.chipsRow}>
              {['4892', '7319', '1580'].map((sample) => (
                <TouchableOpacity
                  key={sample}
                  style={styles.chip}
                  onPress={() => setCode(sample)}
                >
                  <Text style={styles.chipText}>#{sample}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.verifyButton, code.length !== 4 && styles.verifyButtonDisabled]}
            disabled={code.length !== 4}
            onPress={handleVerify}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>Kodni tekshirish va bortga qabul qilish</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  inputContainer: {
    marginVertical: 12,
  },
  input: {
    backgroundColor: COLORS.gray[50],
    borderWidth: 2,
    borderColor: COLORS.emerald[500],
    borderRadius: 14,
    height: 64,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 8,
    color: COLORS.gray[900],
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginBottom: 12,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[200],
    borderWidth: 1,
  },
  feedbackError: {
    backgroundColor: COLORS.red[50],
    borderColor: COLORS.red[200],
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  feedbackTextSuccess: {
    color: COLORS.emerald[900],
  },
  feedbackTextError: {
    color: COLORS.red[900],
  },
  hintSection: {
    backgroundColor: COLORS.gray[50],
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  hintHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[500],
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[700],
  },
  verifyButton: {
    backgroundColor: COLORS.emerald[600],
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  verifyButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
