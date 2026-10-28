import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { useApp } from '../../context/AppContext';
import { Haptics } from '../ui/Haptics';
import {
  UserCheck,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react-native';

export interface PassengerCodeVerifyModalProps {
  visible: boolean;
  onClose: () => void;
  preselectedCode?: string;
}

export const PassengerCodeVerifyModal: React.FC<PassengerCodeVerifyModalProps> = React.memo(
  ({ visible, onClose, preselectedCode }) => {
    const { verifyPassengerCode, activeDriverTrip } = useApp();
    const [code, setCode] = useState(preselectedCode || '');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<{
      success: boolean;
      message: string;
      passengerName?: string;
    } | null>(null);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (visible) {
        setCode(preselectedCode || '');
        setResult(null);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    }, [visible, preselectedCode]);

    const waitingPassengers = activeDriverTrip.passengers.filter((p) => !p.isBoarded);

    const handleVerify = () => {
      const cleanCode = code.trim();
      if (cleanCode.length !== 4) {
        Haptics.warning();
        Alert.alert('Xato', 'Iltimos, yo’lovchining 4 xonali bort kodini to’liq kiriting.');
        return;
      }

      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        const res = verifyPassengerCode(cleanCode);
        setResult(res);

        if (res.success) {
          Haptics.success();
          setTimeout(() => {
            setCode('');
            setResult(null);
            onClose();
          }, 1200);
        } else {
          Haptics.error();
        }
      }, 350);
    };

    const handleClose = () => {
      setCode('');
      setResult(null);
      onClose();
    };

    const handleSelectWaitingPassenger = (passengerCode: string) => {
      Haptics.selection();
      setCode(passengerCode);
    };

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <KeyRound size={22} color={COLORS.amber[400]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Yo’lovchini bortga olish</Text>
                <Text style={styles.subtitle}>Yo’lovchi chiptasidagi 4 xonali bort kodi</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Hidden Input for Native Keyboard Handling */}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={code}
              onChangeText={(val) => {
                const cleaned = val.replace(/\D/g, '').slice(0, 4);
                setCode(cleaned);
                setResult(null);
              }}
              keyboardType="number-pad"
              maxLength={4}
              returnKeyType="done"
              onSubmitEditing={handleVerify}
            />

            {/* 4 Digit Boxes Display */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              style={styles.boxesRow}
            >
              {[0, 1, 2, 3].map((idx) => {
                const digit = code[idx] || '';
                const isFocused = code.length === idx;
                const isFilled = digit !== '';

                return (
                  <View
                    key={idx}
                    style={[
                      styles.digitBox,
                      isFocused && styles.digitBoxActive,
                      isFilled && styles.digitBoxFilled,
                      result && !result.success && styles.digitBoxError,
                      result && result.success && styles.digitBoxSuccess,
                    ]}
                  >
                    <Text
                      style={[
                        styles.digitText,
                        result && result.success && styles.digitTextSuccess,
                      ]}
                    >
                      {digit}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            <Text style={styles.hintText}>
              Yo’lovchi ilovasidagi samolyot chiptasida (Boarding Pass) ko’rsatilgan 4 xonali kod
            </Text>

            {/* Waiting Passengers Quick-Fill Chips (For Demo & Fast Verification) */}
            {waitingPassengers.length > 0 && (
              <View style={styles.waitingContainer}>
                <View style={styles.waitingHeader}>
                  <Users size={12} color={COLORS.amber[400]} />
                  <Text style={styles.waitingTitle}>Kutilayotgan yo’lovchilar:</Text>
                </View>
                <View style={styles.waitingList}>
                  {waitingPassengers.map((wp) => (
                    <TouchableOpacity
                      key={wp.id}
                      style={styles.waitingChip}
                      onPress={() => handleSelectWaitingPassenger(wp.verificationCode)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.waitingChipName}>
                        {wp.name} (Joy #{wp.seatNumber})
                      </Text>
                      <View style={styles.waitingChipCodeBadge}>
                        <Text style={styles.waitingChipCode}>#{wp.verificationCode}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Verification Result Feedback Banner */}
            {result && (
              <View
                style={[
                  styles.feedbackBox,
                  result.success ? styles.feedbackSuccess : styles.feedbackError,
                ]}
              >
                {result.success ? (
                  <CheckCircle2 size={18} color={COLORS.emerald[400]} />
                ) : (
                  <AlertCircle size={18} color={COLORS.red[400]} />
                )}
                <Text
                  style={[
                    styles.feedbackText,
                    result.success ? styles.feedbackSuccessText : styles.feedbackErrorText,
                  ]}
                >
                  {result.message}
                </Text>
              </View>
            )}

            {/* Submit Verification Button */}
            <TouchableOpacity
              style={[
                styles.verifyBtn,
                (code.length !== 4 || isVerifying) && styles.verifyBtnDisabled,
              ]}
              onPress={handleVerify}
              disabled={code.length !== 4 || isVerifying}
              activeOpacity={0.85}
            >
              {isVerifying ? (
                <ActivityIndicator color={COLORS.navy[950]} />
              ) : (
                <>
                  <ShieldCheck size={18} color={COLORS.navy[950]} />
                  <Text style={styles.verifyBtnText}>Kodni tekshirish va bortga olish</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

PassengerCodeVerifyModal.displayName = 'PassengerCodeVerifyModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#111827', // Card Graphite
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 20,
    width: '100%',
    maxWidth: 420,
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  digitBox: {
    width: 58,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#090D16',
    borderWidth: 2,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitBoxActive: {
    borderColor: COLORS.amber[400],
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  digitBoxFilled: {
    borderColor: '#374151',
  },
  digitBoxSuccess: {
    borderColor: COLORS.emerald[400],
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  digitBoxError: {
    borderColor: COLORS.red[400],
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  digitText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  digitTextSuccess: {
    color: COLORS.emerald[400],
  },
  hintText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  waitingContainer: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
  },
  waitingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  waitingTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  waitingList: {
    gap: 6,
  },
  waitingChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  waitingChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  waitingChipCodeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  waitingChipCode: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  feedbackError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  feedbackSuccessText: {
    color: COLORS.emerald[400],
  },
  feedbackErrorText: {
    color: COLORS.red[400],
  },
  verifyBtn: {
    backgroundColor: COLORS.amber[400],
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.md,
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
});
