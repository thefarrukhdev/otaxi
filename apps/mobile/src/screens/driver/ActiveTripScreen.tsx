import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { PassengerCodeVerifyModal } from '../../components/PassengerCodeVerifyModal';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Users,
  CheckCircle,
  AlertCircle,
  Phone,
  Play,
  Flag,
  ShieldAlert,
  KeyRound,
  UserCheck,
  CheckCheck,
} from 'lucide-react-native';

export const ActiveTripScreen: React.FC = () => {
  const { activeDriverTrip, updateTripStatus } = useApp();
  const [isVerifyModalVisible, setVerifyModalVisible] = useState(false);

  const boardedCount = activeDriverTrip.passengers.filter((p) => p.isBoarded).length;
  const totalPassengers = activeDriverTrip.passengers.length;

  const handleCallPassenger = (phone: string, name: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Qo’ng’iroq', `${name} raqami: ${phone}`);
    });
  };

  const handleNextStatus = () => {
    if (activeDriverTrip.status === 'SCHEDULED') {
      if (boardedCount < totalPassengers) {
        Alert.alert(
          'Barcha yo’lovchilar bortda emas',
          `${totalPassengers} tadan faqat ${boardedCount} ta yo’lovchi bortga qabul qilindi. Shunga qaramay safarni boshlaysizmi?`,
          [
            { text: 'Kutish', style: 'cancel' },
            { text: 'Safarni boshlash', onPress: () => updateTripStatus('DEPARTED') },
          ]
        );
      } else {
        updateTripStatus('DEPARTED');
        Alert.alert('Safar boshlandi', 'Oq yo’l! Xavfsizlik qoidalariga rioya qiling.');
      }
    } else if (activeDriverTrip.status === 'DEPARTED') {
      if (activeDriverTrip.isInternational) {
        updateTripStatus('AT_BORDER');
        Alert.alert(
          'Chegara punkti',
          'G’ishtko’prik chegara punktiga yetib kelindi. Yo’lovchilar pasport va bojxona nazoratidan o’tishini kuting.'
        );
      } else {
        handleCompleteTrip();
      }
    } else if (activeDriverTrip.status === 'AT_BORDER') {
      handleCompleteTrip();
    }
  };

  const handleCompleteTrip = () => {
    Alert.alert(
      'Safarni yakunlash',
      'Safar muvaffaqiyatli yakunlandimi? Safar tushumi (324,000 UZS) hamyoningizga avtomatik tarzda o’tkaziladi.',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Ha, yakunlash',
          onPress: () => {
            updateTripStatus('COMPLETED');
            Alert.alert(
              'Safar yakunlandi!',
              '324,000 UZS daromad hamyoningizga muvaffaqiyatli tushirildi (10% komissiya yechildi).'
            );
          },
        },
      ]
    );
  };

  const getStatusLabel = () => {
    switch (activeDriverTrip.status) {
      case 'SCHEDULED':
        return 'Kutilmoqda (Bortga olish)';
      case 'DEPARTED':
        return 'Safarga chiqildi (Yo’lda)';
      case 'AT_BORDER':
        return 'Davlat chegarasida';
      case 'COMPLETED':
        return 'Safar muvaffaqiyatli yakunlandi';
      default:
        return activeDriverTrip.status;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={`${activeDriverTrip.originCity} ➔ ${activeDriverTrip.destinationCity}`}
        subtitle={getStatusLabel()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Trip Stepper Header Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripCardTop}>
            <View>
              <Text style={styles.tripRoute}>
                {activeDriverTrip.originCity} ➔ {activeDriverTrip.destinationCity}
              </Text>
              <Text style={styles.departureTime}>
                Jo’nash vaqti: {activeDriverTrip.departureTime}
              </Text>
            </View>
            <Badge
              label={activeDriverTrip.status}
              variant={activeDriverTrip.status === 'COMPLETED' ? 'emerald' : 'amber'}
            />
          </View>

          {/* Stepper dots */}
          <View style={styles.stepperRow}>
            {['SCHEDULED', 'DEPARTED', 'AT_BORDER', 'COMPLETED'].map((st, idx) => {
              const orderMap = { SCHEDULED: 0, DEPARTED: 1, AT_BORDER: 2, COMPLETED: 3 };
              const currentOrder = orderMap[activeDriverTrip.status];
              const thisOrder = orderMap[st as keyof typeof orderMap];
              const isPastOrCurrent = currentOrder >= thisOrder;

              return (
                <View key={st} style={styles.stepCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      isPastOrCurrent && styles.stepCircleDone,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNum,
                        isPastOrCurrent && styles.stepNumDone,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </View>
                  <Text style={styles.stepName}>
                    {idx === 0
                      ? 'Yig’ilish'
                      : idx === 1
                      ? 'Yo’lda'
                      : idx === 2
                      ? 'Chegara'
                      : 'Yakun'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Boarding Action CTA */}
        <TouchableOpacity
          style={styles.verifyCtaBtn}
          onPress={() => setVerifyModalVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.verifyCtaIcon}>
            <KeyRound size={22} color={COLORS.emerald[700]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.verifyCtaTitle}>Yo’lovchi kodini tekshirish</Text>
            <Text style={styles.verifyCtaSubtitle}>
              Yo'lovchining 4 xonali bortga chiqish kodini kiritib tasdiqlang
            </Text>
          </View>
          <UserCheck size={20} color={COLORS.emerald[400]} />
        </TouchableOpacity>

        {/* Passenger Manifest */}
        <View style={styles.manifestSection}>
          <View style={styles.manifestHeader}>
            <Text style={styles.manifestTitle}>Yo’lovchilar ro’yxati (Manifest)</Text>
            <Text style={styles.manifestProgress}>
              {boardedCount} / {totalPassengers} bortda
            </Text>
          </View>

          {activeDriverTrip.passengers.map((passenger) => (
            <View
              key={passenger.id}
              style={[
                styles.passengerCard,
                passenger.isBoarded && styles.passengerCardBoarded,
              ]}
            >
              <View style={styles.passengerTopRow}>
                <View style={styles.seatBadge}>
                  <Text style={styles.seatBadgeText}>Joy #{passenger.seatNumber}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.passengerName}>{passenger.name}</Text>
                  <Text style={styles.passengerPhone}>{passenger.phone}</Text>
                </View>
                <Badge
                  label={passenger.isBoarded ? 'Bortda' : 'Kutilmoqda'}
                  variant={passenger.isBoarded ? 'emerald' : 'amber'}
                  icon={
                    passenger.isBoarded ? (
                      <CheckCheck size={12} color={COLORS.emerald[700]} />
                    ) : (
                      <Users size={12} color={COLORS.amber[700]} />
                    )
                  }
                />
              </View>

              <View style={styles.passengerMetaRow}>
                <View style={styles.codePill}>
                  <Text style={styles.codePillLabel}>Kodi:</Text>
                  <Text style={styles.codePillVal}>#{passenger.verificationCode}</Text>
                </View>

                {passenger.passportNumber && (
                  <View style={styles.passportPill}>
                    <Text style={styles.passportPillText}>
                      Pasport: {passenger.passportNumber}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.callIconBtn}
                  onPress={() => handleCallPassenger(passenger.phone, passenger.name)}
                >
                  <Phone size={14} color={COLORS.emerald[400]} />
                  <Text style={styles.callIconText}>Qo'ng'iroq</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Trip Control Buttons */}
        {activeDriverTrip.status !== 'COMPLETED' && (
          <TouchableOpacity
            style={styles.nextStatusBtn}
            onPress={handleNextStatus}
            activeOpacity={0.85}
          >
            {activeDriverTrip.status === 'SCHEDULED' && (
              <>
                <Play size={18} color={COLORS.white} />
                <Text style={styles.nextStatusBtnText}>Safarni boshlash</Text>
              </>
            )}
            {activeDriverTrip.status === 'DEPARTED' && (
              <>
                <ShieldAlert size={18} color={COLORS.white} />
                <Text style={styles.nextStatusBtnText}>
                  {activeDriverTrip.isInternational
                    ? 'Chegara punktiga yetib kelindi'
                    : 'Safarni yakunlash'}
                </Text>
              </>
            )}
            {activeDriverTrip.status === 'AT_BORDER' && (
              <>
                <Flag size={18} color={COLORS.white} />
                <Text style={styles.nextStatusBtnText}>Safarni yakunlash</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* SOS Emergency */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => Alert.alert('SOS', 'OTAXI Favqulodda dispetcherlik markazi: 112 / +998 71 200 00 00')}
        >
          <ShieldAlert size={16} color={COLORS.red[400]} />
          <Text style={styles.sosButtonText}>Favqulodda SOS dispetcher</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Code Verify Modal */}
      <PassengerCodeVerifyModal
        visible={isVerifyModalVisible}
        onClose={() => setVerifyModalVisible(false)}
      />
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
  tripCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.navy[700],
    marginBottom: 14,
    ...SHADOWS.md,
  },
  tripCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripRoute: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  departureTime: {
    fontSize: 12,
    color: COLORS.navy[300],
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.navy[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: COLORS.emerald[600],
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.navy[400],
  },
  stepNumDone: {
    color: COLORS.white,
  },
  stepName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.navy[300],
  },
  verifyCtaBtn: {
    backgroundColor: '#0a3322',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.emerald[600],
    marginBottom: 18,
    ...SHADOWS.md,
  },
  verifyCtaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.emerald[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyCtaTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  verifyCtaSubtitle: {
    fontSize: 11,
    color: COLORS.emerald[300],
    marginTop: 2,
  },
  manifestSection: {
    marginBottom: 20,
  },
  manifestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  manifestTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[200],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manifestProgress: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  passengerCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    marginBottom: 10,
  },
  passengerCardBoarded: {
    borderColor: COLORS.emerald[700],
    backgroundColor: '#0d2218',
  },
  passengerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatBadge: {
    backgroundColor: COLORS.navy[800],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  seatBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  passengerName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  passengerPhone: {
    fontSize: 11,
    color: COLORS.navy[400],
    marginTop: 1,
  },
  passengerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.navy[800],
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy[800],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  codePillLabel: {
    fontSize: 10,
    color: COLORS.navy[400],
    fontWeight: '600',
  },
  codePillVal: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.amber[400],
  },
  passportPill: {
    backgroundColor: COLORS.navy[800],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  passportPillText: {
    fontSize: 10,
    color: COLORS.navy[300],
    fontWeight: '600',
  },
  callIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: COLORS.navy[800],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  callIconText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald[400],
  },
  nextStatusBtn: {
    backgroundColor: COLORS.emerald[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
    ...SHADOWS.md,
  },
  nextStatusBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b1010',
    borderWidth: 1,
    borderColor: COLORS.red[800],
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  sosButtonText: {
    color: COLORS.red[400],
    fontSize: 12,
    fontWeight: '800',
  },
});
