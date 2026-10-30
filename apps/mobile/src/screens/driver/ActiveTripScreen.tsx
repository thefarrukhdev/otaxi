import React, { useState, useMemo } from 'react';
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
import { Button, Card, Badge } from '../../components/ui';
import { RouteMap } from '../../components/RouteMap';
import { LiveTrackingCard } from '../../components/LiveTrackingCard';
import { PassengerManifestCard } from '../../components/driver/PassengerManifestCard';
import { PassengerCodeVerifyModal } from '../../components/driver/PassengerCodeVerifyModal';
import { useApp } from '../../context/AppContext';
import { Haptics } from '../../components/ui/Haptics';
import { ManifestPassenger } from '../../types';
import {
  Car,
  Users,
  CheckCircle2,
  AlertCircle,
  Phone,
  Play,
  Flag,
  ShieldAlert,
  KeyRound,
  ShieldCheck,
  Globe,
  Radio,
  Clock,
  Wallet,
  ArrowRight,
  Compass,
} from 'lucide-react-native';

export const ActiveTripScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { activeDriverTrip, updateTripStatus, driverBalance } = useApp();
  const [isVerifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedPassengerForVerify, setSelectedPassengerForVerify] = useState<
    ManifestPassenger | undefined
  >(undefined);

  const boardedCount = activeDriverTrip.passengers.filter((p) => p.isBoarded).length;
  const totalPassengers = activeDriverTrip.passengers.length;
  const allBoarded = totalPassengers > 0 && boardedCount === totalPassengers;

  // Dynamic cockpit telematics for RouteMap
  const driverProgressPercent = useMemo(() => {
    switch (activeDriverTrip.status) {
      case 'SCHEDULED':
        return 8; // At departure terminal
      case 'DEPARTED':
        return 42; // En route along highway M39
      case 'AT_BORDER':
        return 50; // At customs post G'isht-Ko'prik
      case 'COMPLETED':
        return 100; // Arrived at destination
      default:
        return 15;
    }
  }, [activeDriverTrip.status]);

  const driverSpeedKmH = useMemo(() => {
    switch (activeDriverTrip.status) {
      case 'DEPARTED':
        return 88;
      case 'AT_BORDER':
        return 0; // Waiting at customs
      case 'SCHEDULED':
      case 'COMPLETED':
      default:
        return 0;
    }
  }, [activeDriverTrip.status]);

  const driverStatusNote = useMemo(() => {
    switch (activeDriverTrip.status) {
      case 'SCHEDULED':
        return 'Terminalda kutilmoqda • Bortga olish jarayoni';
      case 'DEPARTED':
        return 'M39 magistralida harakatlanmoqda • Chegara tomon';
      case 'AT_BORDER':
        return "G'isht-Ko'prik chegara postida • Pasport va bojxona ko'rigi";
      case 'COMPLETED':
        return 'Safar muvaffaqiyatli yakunlandi • Manzilda';
      default:
        return undefined;
    }
  }, [activeDriverTrip.status]);

  const handleCallPassenger = (phone: string, name: string) => {
    Haptics.light();
    const cleanPhone = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Qo’ng’iroq', `${name} raqami: ${phone}`);
    });
  };

  const handleOpenVerifyModal = (passenger?: ManifestPassenger) => {
    setSelectedPassengerForVerify(passenger);
    setVerifyModalVisible(true);
  };

  const handleNextStatus = () => {
    Haptics.medium();

    if (activeDriverTrip.status === 'SCHEDULED') {
      if (!allBoarded) {
        Alert.alert(
          'Barcha yo’lovchilar salonda emas!',
          `${totalPassengers} tadan faqat ${boardedCount} ta yo’lovchi qabul qilindi. Shunga qaramay safarni boshlaysizmi?`,
          [
            { text: 'Kutish', style: 'cancel' },
            {
              text: 'Safarni boshlash',
              onPress: () => {
                updateTripStatus('DEPARTED');
                Haptics.success();
                Alert.alert('Safar boshlandi', 'Oq yo’l! Magistral xavfsizlik qoidalariga rioya qiling.');
              },
            },
          ]
        );
      } else {
        updateTripStatus('DEPARTED');
        Haptics.success();
        Alert.alert('Safar boshlandi', 'Barcha yo’lovchilar joylashdi! Oq yo’l!');
      }
    } else if (activeDriverTrip.status === 'DEPARTED') {
      if (activeDriverTrip.isInternational) {
        updateTripStatus('AT_BORDER');
        Haptics.medium();
        Alert.alert(
          'Davlat chegarasi punkti',
          'G’ishtko’prik chegara punktiga yetib kelindi. Yo’lovchilar pasport va bojxona nazoratidan o’tishini kuting.'
        );
      } else {
        promptCompleteTrip();
      }
    } else if (activeDriverTrip.status === 'AT_BORDER') {
      promptCompleteTrip();
    }
  };

  const promptCompleteTrip = () => {
    Haptics.medium();
    Alert.alert(
      'Safarni yakunlash',
      'Manzilga yetib kelindimi? Safar tushumi (324,000 UZS sof foyda) hamyoningizga bir zumda o’tkaziladi.',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Ha, yakunlash',
          onPress: () => {
            updateTripStatus('COMPLETED');
            Haptics.success();
            Alert.alert(
              'Safar muvaffaqiyatli yakunlandi!',
              '324,000 UZS daromad hamyoningizga muvaffaqiyatli tushirildi. Yangi reys e’lon qilishingiz mumkin.'
            );
          },
        },
      ]
    );
  };

  const steps = [
    { key: 'SCHEDULED', title: 'Kutilmoqda', subtitle: 'Bortga olish', icon: Users },
    { key: 'DEPARTED', title: 'Yo’lga chiqildi', subtitle: 'Magistralda', icon: Car },
    { key: 'AT_BORDER', title: 'Chegarada', subtitle: 'Bojxona posti', icon: ShieldCheck },
    { key: 'COMPLETED', title: 'Yakunlandi', subtitle: 'Manzilda', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 0;
      case 'DEPARTED':
        return 1;
      case 'AT_BORDER':
        return 2;
      case 'COMPLETED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeDriverTrip.status);

  return (
    <View style={styles.container}>
      <Header
        title={`${activeDriverTrip.originCity} ➔ ${activeDriverTrip.destinationCity}`}
        subtitle={
          activeDriverTrip.status === 'SCHEDULED'
            ? 'Bortga olish va kodlarni tekshirish'
            : activeDriverTrip.status === 'DEPARTED'
            ? 'Magistral yo’lda harakatlanmoqda'
            : activeDriverTrip.status === 'AT_BORDER'
            ? 'Davlat chegara postida'
            : 'Safar muvaffaqiyatli yakunlandi'
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status Stepper Card */}
        <Card variant="surface" style={styles.stepperCard}>
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperTitle}>Safar bosqichlari</Text>
            <Text
              style={[
                styles.tripStatusText,
                activeDriverTrip.status === 'COMPLETED'
                  ? styles.tripStatusTextCompleted
                  : styles.tripStatusTextActive,
              ]}
            >
              {activeDriverTrip.status === 'SCHEDULED' && 'Kutilmoqda'}
              {activeDriverTrip.status === 'DEPARTED' && 'Safarga chiqildi'}
              {activeDriverTrip.status === 'AT_BORDER' && 'Chegara postida'}
              {activeDriverTrip.status === 'COMPLETED' && 'Yakunlandi'}
            </Text>
          </View>

          {/* Stepper Progress Visual Track */}
          <View style={styles.stepperVisualRow}>
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const IconComp = st.icon;

              return (
                <React.Fragment key={st.key}>
                  <View style={styles.stepNode}>
                    <View
                      style={[
                        styles.stepCircle,
                        isPast && styles.stepCircleDone,
                        isCurrent && styles.stepCircleCurrent,
                      ]}
                    >
                      <IconComp
                        size={14}
                        color={
                          isCurrent
                            ? COLORS.navy[950]
                            : isPast
                            ? '#FFFFFF'
                            : '#64748B'
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.stepNodeTitle,
                        (isPast || isCurrent) && styles.stepNodeTitleActive,
                      ]}
                    >
                      {st.title}
                    </Text>
                    <Text style={styles.stepNodeSub}>{st.subtitle}</Text>
                  </View>

                  {idx < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        idx < currentStepIdx && styles.stepConnectorDone,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </Card>

        {/* Interactive Tactical Route Corridor Map (Obsidian Cockpit Mode) */}
        <RouteMap
          originCity={activeDriverTrip.originCity}
          destinationCity={activeDriverTrip.destinationCity}
          isInternational={activeDriverTrip.isInternational}
          borderName={activeDriverTrip.isInternational ? "G'isht-Ko'prik / Chernyayevka" : undefined}
          borderWaitMinutes={25}
          progressPercent={driverProgressPercent}
          themeMode="dark"
          currentSpeedKmH={driverSpeedKmH}
          statusNote={driverStatusNote}
          onPressBorder={() => {
            if (activeDriverTrip.isInternational) {
              Haptics.medium();
              Alert.alert(
                "G'isht-Ko'prik Bojxona Posti (KZ Chegarasi)",
                "Joriy kutish vaqti: ~25 daqiqa (Yashil yo'lak)\nHaydovchi va yo'lovchilar xorijiy biometrik pasporti hamda avtomobil texnik pasporti tayyor turishi lozim."
              );
            }
          }}
        />

        {/* Real-time Telemetry & Live Speedometer Card */}
        <LiveTrackingCard
          tripId={activeDriverTrip.id}
          isInternational={activeDriverTrip.isInternational}
          routeType={
            activeDriverTrip.destinationCity.toLowerCase().includes('chimkent') ||
            activeDriverTrip.destinationCity.toLowerCase().includes('shymkent')
              ? 'TASHKENT_SHYMKENT'
              : 'TASHKENT_SAMARKAND'
          }
          originCity={activeDriverTrip.originCity}
          destinationCity={activeDriverTrip.destinationCity}
          speedKmH={
            activeDriverTrip.status === 'SCHEDULED' || activeDriverTrip.status === 'COMPLETED'
              ? 0
              : activeDriverTrip.status === 'AT_BORDER'
              ? 0
              : undefined
          }
          onPressDetails={() => {
            Haptics.light();
            Alert.alert(
              'Jonli Telemetriya Tafsilotlari',
              `Reys: ${activeDriverTrip.originCity} ➔ ${activeDriverTrip.destinationCity}\nHolat: ${
                activeDriverTrip.status === 'DEPARTED'
                  ? 'Magistralda harakatlanmoqda (Jonli GPS)'
                  : activeDriverTrip.status === 'AT_BORDER'
                  ? "Davlat chegarasi postida (G'isht-Ko'prik)"
                  : 'Bortga olish jarayoni'
              }\nProtokol: Socket.IO Gateway (/tracking)`
            );
          }}
        />

        {/* Route Summary Info Card */}
        <Card variant="surface" style={styles.routeCard}>
          <View style={styles.routeHeaderRow}>
            <View>
              <View style={styles.routeBadgeRow}>
                {activeDriverTrip.isInternational && (
                  <Badge label="Xalqaro reys" variant="brand" size="sm" />
                )}
                <Text style={styles.departureTimeText}>
                  Jo’nash: {activeDriverTrip.departureTime}
                </Text>
              </View>

              <Text style={styles.routeTitle}>
                {activeDriverTrip.originCity} ➔ {activeDriverTrip.destinationCity}
              </Text>
              <Text style={styles.routeAddress}>
                {activeDriverTrip.originAddress}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleMetaRow}>
            <Car size={14} color={COLORS.amber[400]} />
            <Text style={styles.vehicleMetaText}>
              {activeDriverTrip.vehicle.make} {activeDriverTrip.vehicle.model} • Davlat raqami:{' '}
              <Text style={styles.plateText}>{activeDriverTrip.vehicle.licensePlate}</Text>
            </Text>
          </View>
        </Card>

        {/* Low Connectivity / Mountain Pass Alert */}
        <View style={styles.corridorOfflineBanner}>
          <Radio size={15} color={COLORS.amber[400]} />
          <Text style={styles.corridorOfflineText}>
            Tungi magistral / Tog’ dovoni rejimi: GPS telemetriya qurilmada xavfsiz oflayn xotiraga yozilmoqda.
          </Text>
        </View>

        {/* Passenger Manifest Component */}
        <PassengerManifestCard
          passengers={activeDriverTrip.passengers}
          onVerifyCodePress={handleOpenVerifyModal}
          onCallPassenger={handleCallPassenger}
        />

        {/* Main Progression Action Button */}
        {activeDriverTrip.status !== 'COMPLETED' ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={
              activeDriverTrip.status === 'SCHEDULED' ? (
                <Play size={18} color="#0C0D11" />
              ) : activeDriverTrip.status === 'DEPARTED' ? (
                activeDriverTrip.isInternational ? (
                  <ShieldCheck size={18} color="#0C0D11" />
                ) : (
                  <Flag size={18} color="#0C0D11" />
                )
              ) : (
                <Flag size={18} color="#0C0D11" />
              )
            }
            title={
              activeDriverTrip.status === 'SCHEDULED'
                ? "Safarga chiqish (Barcha yo'lovchilar bilan)"
                : activeDriverTrip.status === 'DEPARTED'
                ? activeDriverTrip.isInternational
                  ? "Chegara punktiga yetib kelindi (Bojxona)"
                  : "Safarni yakunlash va daromadni olish"
                : "Chegaradan o'tildi va safarni yakunlash"
            }
            onPress={handleNextStatus}
          />
        ) : (
          <Card variant="surface" style={styles.completedTripCard}>
            <View style={styles.completedHeader}>
              <CheckCircle2 size={24} color={COLORS.emerald[400]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.completedTitle}>Safar muvaffaqiyatli yakunlangan!</Text>
                <Text style={styles.completedDesc}>
                  324,000 UZS sof tushum haydovchi hamyoningizga o’tkazildi.
                </Text>
              </View>
            </View>

            {navigation && (
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<Wallet size={16} color="#FF8800" />}
                rightIcon={<ArrowRight size={14} color="#FF8800" />}
                title="Hamyon va balansni ko'rish"
                onPress={() => {
                  Haptics.selection();
                  navigation.navigate('Wallet');
                }}
                style={{ marginTop: 12 }}
              />
            )}
          </Card>
        )}

        {/* SOS Emergency Dispatcher */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => {
            Haptics.warning();
            Alert.alert(
              'OTAXI Favqulodda Dispetcherlik Markazi',
              'Tezkor yordam kerakmi?\n\nDispetcher: +998 71 200 00 00\nFavqulodda xizmat: 112\n\nGPS joylashuvingiz navbatchi guruhga uzatildi.',
              [
                { text: 'Yopish', style: 'cancel' },
                {
                  text: 'Qo’ng’iroq qilish',
                  onPress: () => Linking.openURL('tel:112'),
                },
              ]
            );
          }}
          activeOpacity={0.8}
        >
          <ShieldAlert size={16} color="#EF4444" />
          <Text style={styles.sosButtonText}>Favqulodda SOS dispetcherlik xizmati</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 4-digit Code Verify Modal */}
      <PassengerCodeVerifyModal
        visible={isVerifyModalVisible}
        onClose={() => setVerifyModalVisible(false)}
        preselectedCode={selectedPassengerForVerify?.verificationCode}
      />
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
  stepperCard: {
    backgroundColor: '#15171E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#272B35',
    marginBottom: 14,
    ...SHADOWS.md,
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepperTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  tripStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tripStatusTextActive: {
    color: '#FF8800',
  },
  tripStatusTextCompleted: {
    color: '#10B981',
  },
  stepperVisualRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  stepNode: {
    alignItems: 'center',
    width: 68,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleDone: {
    backgroundColor: COLORS.emerald[600],
    borderColor: COLORS.emerald[500],
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.amber[400],
    borderColor: COLORS.amber[300],
    ...SHADOWS.sm,
  },
  stepNodeTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  stepNodeTitleActive: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  stepNodeSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
    textAlign: 'center',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#1E293B',
    marginTop: 15,
  },
  stepConnectorDone: {
    backgroundColor: COLORS.emerald[600],
  },
  routeCard: {
    backgroundColor: '#15171E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#272B35',
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  routeHeaderRow: {
    marginBottom: 10,
  },
  routeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  intlFlagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  departureTimeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  routeAddress: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  vehicleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  vehicleMetaText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  plateText: {
    fontWeight: '800',
    color: '#F8FAFC',
  },
  corridorOfflineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginBottom: 14,
  },
  corridorOfflineText: {
    flex: 1,
    fontSize: 11,
    color: '#E2E8F0',
    lineHeight: 16,
  },
  primaryActionBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
    ...SHADOWS.md,
  },
  primaryActionBtnScheduled: {
    backgroundColor: COLORS.amber[400],
  },
  primaryActionBtnDeparted: {
    backgroundColor: COLORS.amber[400],
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy[950],
  },
  completedTripCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 14,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  completedDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  viewWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#15171E',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  viewWalletBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A0A0A',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  sosButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
});
