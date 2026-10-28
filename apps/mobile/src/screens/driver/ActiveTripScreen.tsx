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
          'Barcha yo’lovchilar bortda emas!',
          `${totalPassengers} tadan faqat ${boardedCount} ta yo’lovchi bortga qabul qilindi. Shunga qaramay safarni boshlaysizmi?`,
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
        Alert.alert('Safar boshlandi', 'Barcha yo’lovchilar bortda! Oq yo’l!');
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
              'Safar muvaffaqiyatli yakunlandi! 🎉',
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
        <View style={styles.stepperCard}>
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperTitle}>SAFAR HOLATI STEYPERI</Text>
            <View
              style={[
                styles.tripStatusBadge,
                activeDriverTrip.status === 'COMPLETED'
                  ? styles.tripStatusBadgeCompleted
                  : styles.tripStatusBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.tripStatusBadgeText,
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
        </View>

        {/* Route Summary Info Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeHeaderRow}>
            <View>
              <View style={styles.routeBadgeRow}>
                {activeDriverTrip.isInternational && (
                  <View style={styles.internationalTag}>
                    <Globe size={11} color={COLORS.amber[400]} />
                    <Text style={styles.internationalTagText}>Xalqaro Chegara Reysi</Text>
                  </View>
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
        </View>

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
          <TouchableOpacity
            style={[
              styles.primaryActionBtn,
              activeDriverTrip.status === 'SCHEDULED'
                ? styles.primaryActionBtnScheduled
                : styles.primaryActionBtnDeparted,
            ]}
            onPress={handleNextStatus}
            activeOpacity={0.85}
          >
            {activeDriverTrip.status === 'SCHEDULED' && (
              <>
                <Play size={18} color={COLORS.navy[950]} />
                <Text style={styles.primaryActionBtnText}>
                  Safarga chiqish (Barcha yo’lovchilar bilan)
                </Text>
              </>
            )}

            {activeDriverTrip.status === 'DEPARTED' && (
              <>
                {activeDriverTrip.isInternational ? (
                  <>
                    <ShieldCheck size={18} color={COLORS.navy[950]} />
                    <Text style={styles.primaryActionBtnText}>
                      Chegara punktiga yetib kelindi (Bojxona)
                    </Text>
                  </>
                ) : (
                  <>
                    <Flag size={18} color={COLORS.navy[950]} />
                    <Text style={styles.primaryActionBtnText}>
                      Safarni yakunlash va daromadni olish
                    </Text>
                  </>
                )}
              </>
            )}

            {activeDriverTrip.status === 'AT_BORDER' && (
              <>
                <Flag size={18} color={COLORS.navy[950]} />
                <Text style={styles.primaryActionBtnText}>
                  Chegaradan o’tildi va safarni yakunlash
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.completedTripCard}>
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
              <TouchableOpacity
                style={styles.viewWalletBtn}
                onPress={() => {
                  Haptics.selection();
                  navigation.navigate('Wallet');
                }}
                activeOpacity={0.85}
              >
                <Wallet size={16} color={COLORS.amber[400]} />
                <Text style={styles.viewWalletBtnText}>Hamyon va balansni ko’rish</Text>
                <ArrowRight size={14} color={COLORS.amber[400]} />
              </TouchableOpacity>
            )}
          </View>
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
    backgroundColor: '#090D16', // Cockpit Obsidian
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  stepperCard: {
    backgroundColor: '#111827', // Card Graphite
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#1F2937',
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
  tripStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tripStatusBadgeActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  tripStatusBadgeCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tripStatusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tripStatusTextActive: {
    color: COLORS.amber[400],
  },
  tripStatusTextCompleted: {
    color: COLORS.emerald[400],
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
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
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
  internationalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  internationalTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.amber[400],
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
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
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
