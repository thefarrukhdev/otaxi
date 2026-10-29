import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { ManifestPassenger } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Haptics } from '../ui/Haptics';
import {
  Users,
  CheckCircle2,
  Clock,
  Phone,
  KeyRound,
  CreditCard,
  Banknote,
  CheckCheck,
  ShieldCheck,
  FileText,
} from 'lucide-react-native';

export interface PassengerManifestCardProps {
  passengers: ManifestPassenger[];
  onVerifyCodePress: (passenger?: ManifestPassenger) => void;
  onCallPassenger?: (phone: string, name: string) => void;
}

const getSeatLabel = (seatNumber: number): string => {
  switch (seatNumber) {
    case 1:
      return 'Joy #1 (Old VIP)';
    case 2:
      return 'Joy #2 (Orqa chap)';
    case 3:
      return 'Joy #3 (Orqa o’rta)';
    case 4:
      return 'Joy #4 (Orqa o’ng)';
    default:
      return `Joy #${seatNumber}`;
  }
};

export const PassengerManifestCard: React.FC<PassengerManifestCardProps> = React.memo(
  ({ passengers, onVerifyCodePress, onCallPassenger }) => {
    const totalCount = passengers.length;
    const boardedCount = passengers.filter((p) => p.isBoarded).length;
    const progressPercent = totalCount > 0 ? Math.round((boardedCount / totalCount) * 100) : 0;
    const allBoarded = totalCount > 0 && boardedCount === totalCount;

    const handleCall = (phone: string, name: string) => {
      Haptics.light();
      if (onCallPassenger) {
        onCallPassenger(phone, name);
      } else {
        const cleaned = phone.replace(/\s+/g, '');
        Linking.openURL(`tel:${cleaned}`).catch(() => {
          Alert.alert('Qo’ng’iroq', `${name} raqami: ${phone}`);
        });
      }
    };

    const handleVerifyPress = (passenger?: ManifestPassenger) => {
      Haptics.medium();
      onVerifyCodePress(passenger);
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconCircle}>
              <Users size={18} color={COLORS.amber[400]} />
            </View>
            <View>
              <Text style={styles.title}>Yo’lovchilar Manifesti</Text>
              <Text style={styles.subtitle}>Faol reysdagi barcha o’rindiqlar holati</Text>
            </View>
          </View>
          <View style={[styles.counterBadge, allBoarded && styles.counterBadgeComplete]}>
            <Text style={[styles.counterText, allBoarded && styles.counterTextComplete]}>
              {boardedCount}/{totalCount} Bortda
            </Text>
          </View>
        </View>

        {/* Boarding Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
                allBoarded && styles.progressBarFillComplete,
              ]}
            />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>Bortga chiqish progressi</Text>
            <Text style={[styles.progressPercent, allBoarded && styles.progressPercentComplete]}>
              {progressPercent}%
            </Text>
          </View>
        </View>

        {/* Passengers List */}
        <View style={styles.passengerList}>
          {passengers.map((passenger) => {
            const isBoarded = passenger.isBoarded;

            return (
              <View
                key={passenger.id}
                style={[
                  styles.passengerCard,
                  isBoarded ? styles.passengerCardBoarded : styles.passengerCardWaiting,
                ]}
              >
                {/* Top Row: Seat & Status Badge */}
                <View style={styles.passengerTopRow}>
                  <View style={[styles.seatBadge, isBoarded && styles.seatBadgeBoarded]}>
                    <Text style={[styles.seatBadgeText, isBoarded && styles.seatBadgeTextBoarded]}>
                      {getSeatLabel(passenger.seatNumber)}
                    </Text>
                  </View>

                  <View style={styles.statusBadgeWrap}>
                    {isBoarded ? (
                      <View style={styles.statusRowInline}>
                        <CheckCheck size={13} color="#10B981" />
                        <Text style={styles.boardedText}>Mashinada</Text>
                      </View>
                    ) : (
                      <View style={styles.statusRowInline}>
                        <Clock size={13} color="#FF8800" />
                        <Text style={styles.waitingText}>Kutilmoqda</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Passenger Info & Payment */}
                <View style={styles.passengerMainRow}>
                  <View style={styles.passengerIdentity}>
                    <Text style={styles.passengerName}>{passenger.name}</Text>
                    <Text style={styles.passengerPhone}>{passenger.phone}</Text>

                    {passenger.passportNumber && (
                      <View style={styles.passportRow}>
                        <FileText size={12} color={COLORS.navy[400]} />
                        <Text style={styles.passportText}>
                          Xorijiy pasport: {passenger.passportNumber}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Payment Info */}
                  <View style={styles.paymentCol}>
                    {passenger.paymentStatus === 'PAID' ? (
                      <View style={styles.paidRow}>
                        <CreditCard size={12} color="#10B981" />
                        <Text style={styles.paidText}>To’langan</Text>
                      </View>
                    ) : (
                      <View style={styles.cashRow}>
                        <Banknote size={12} color="#FF8800" />
                        <Text style={styles.cashText}>Yetib borganda</Text>
                      </View>
                    )}

                    {isBoarded && (
                      <View style={styles.verifiedCodeRow}>
                        <ShieldCheck size={11} color="#10B981" />
                        <Text style={styles.verifiedCodeText}>#{passenger.verificationCode}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Passenger Action Buttons */}
                <View style={styles.passengerActionsRow}>
                  <TouchableOpacity
                    style={styles.actionCallBtn}
                    onPress={() => handleCall(passenger.phone, passenger.name)}
                    activeOpacity={0.8}
                  >
                    <Phone size={14} color={COLORS.navy[200]} />
                    <Text style={styles.actionCallText}>Qo’ng’iroq qilish</Text>
                  </TouchableOpacity>

                  {!isBoarded ? (
                    <TouchableOpacity
                      style={styles.actionVerifyBtn}
                      onPress={() => handleVerifyPress(passenger)}
                      activeOpacity={0.85}
                    >
                      <KeyRound size={14} color={COLORS.navy[950]} />
                      <Text style={styles.actionVerifyText}>Kodni kiritish</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.boardedConfirmedNote}>
                      <CheckCircle2 size={13} color={COLORS.emerald[400]} />
                      <Text style={styles.boardedConfirmedText}>Bortga olingan</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Global CTA if passengers waiting */}
        {!allBoarded ? (
          <TouchableOpacity
            style={styles.mainVerifyCta}
            onPress={() => handleVerifyPress()}
            activeOpacity={0.85}
          >
            <KeyRound size={18} color={COLORS.navy[950]} />
            <Text style={styles.mainVerifyCtaText}>Yo’lovchi kodini tekshirish (OTP)</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.allBoardedBanner}>
            <CheckCircle2 size={18} color={COLORS.emerald[400]} />
            <Text style={styles.allBoardedBannerText}>
              Barcha yo’lovchilar qabul qilindi. Safarni boshlashingiz mumkin!
            </Text>
          </View>
        )}
      </View>
    );
  }
);

PassengerManifestCard.displayName = 'PassengerManifestCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827', // Card Graphite
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  counterBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  counterBadgeComplete: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  counterTextComplete: {
    color: COLORS.emerald[400],
  },
  progressContainer: {
    marginBottom: 16,
    backgroundColor: '#090D16',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#1F2937',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.amber[400],
    borderRadius: 3,
  },
  progressBarFillComplete: {
    backgroundColor: COLORS.emerald[400],
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  progressPercentComplete: {
    color: COLORS.emerald[400],
  },
  passengerList: {
    gap: 12,
  },
  passengerCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  passengerCardWaiting: {
    backgroundColor: '#090D16',
    borderColor: '#1F2937',
  },
  passengerCardBoarded: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  passengerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seatBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  seatBadgeBoarded: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  seatBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  seatBadgeTextBoarded: {
    color: COLORS.emerald[400],
  },
  statusBadgeWrap: {},
  statusRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boardedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  waitingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  passengerMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  passengerIdentity: {
    flex: 1,
    paddingRight: 8,
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  passengerPhone: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  passportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  passportText: {
    fontSize: 11,
    color: '#64748B',
  },
  paymentCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paidText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  cashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cashText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  verifiedCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    fontVariant: ['tabular-nums'],
  },
  passengerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  actionCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionCallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  actionVerifyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.amber[400],
    paddingVertical: 9,
    borderRadius: 10,
  },
  actionVerifyText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
  boardedConfirmedNote: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  boardedConfirmedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[400],
  },
  mainVerifyCta: {
    marginTop: 14,
    backgroundColor: COLORS.amber[400],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    ...SHADOWS.md,
  },
  mainVerifyCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
  allBoardedBanner: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  allBoardedBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[400],
    lineHeight: 17,
  },
});
