import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { SeatMap } from '../../components/SeatMap';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import { Haptics } from '../../components/ui/Haptics';
import { useApp } from '../../context/AppContext';
import { getBorderChecklist } from '../../lib/data';
import { PaymentProvider, CountryCode } from '@otaxi/types';
import {
  Star,
  ShieldCheck,
  Globe,
  Clock,
  Car,
  Wind,
  Luggage,
  Timer,
  CheckCircle,
  CreditCard,
  Wallet,
  AlertTriangle,
  User,
  Phone,
  FileText,
  BatteryCharging,
  CigaretteOff,
  ArrowRight,
  ChevronRight,
} from 'lucide-react-native';

interface TripDetailsScreenProps {
  navigation: any;
  route: any;
}

const formatClockTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  } catch {
    return '00:00';
  }
};

export const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { trips, bookTrip, checkedItems } = useApp();
  const tripId = route.params?.tripId;
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  // Default selection: seat 1 (front VIP) if available, else first available
  const initialSeat = useMemo(() => {
    const seat1 = trip.seats.find((s) => s.seatNumber === 1 && s.isAvailable);
    if (seat1) return [1];
    const firstAvail = trip.seats.find((s) => s.isAvailable);
    return firstAvail ? [firstAvail.seatNumber] : [];
  }, [trip.seats]);

  const [selectedSeats, setSelectedSeats] = useState<number[]>(initialSeat);
  const [passengerName, setPassengerName] = useState('Farrukh Bek');
  const [passengerPhone, setPassengerPhone] = useState('+998 90 999 88 11');
  const [passportNumber, setPassportNumber] = useState('FA1234567');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>(
    PaymentProvider.PAYME
  );
  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const [checklistAcknowledged, setChecklistAcknowledged] = useState(false);

  // 10-minute hold reservation timer
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes = 600s
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining
      .toString()
      .padStart(2, '0')}`;
  };

  const handleToggleSeat = (seatNum: number) => {
    Haptics.selection();
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  // Dynamic price calculation with VIP priceDelta
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seatNum) => {
      const seat = trip.seats.find((s) => s.seatNumber === seatNum);
      const delta = seat ? seat.priceDelta : 0;
      return sum + trip.pricePerSeat + delta;
    }, 0);
  }, [selectedSeats, trip.seats, trip.pricePerSeat]);

  // Border checklist stats
  const borderChecklist = useMemo(
    () => getBorderChecklist(trip.originCountry, trip.destinationCountry),
    [trip.originCountry, trip.destinationCountry]
  );

  const totalRequiredChecklist = borderChecklist.items.filter((i) => i.isRequired).length;
  const checkedRequiredCount = borderChecklist.items.filter(
    (i) => i.isRequired && checkedItems[i.id]
  ).length;

  const handleBooking = () => {
    if (isExpired) {
      Haptics.error();
      Alert.alert(
        'Vaqt tugadi',
        'O\'rindiqni vaqtinchalik band qilish 10 daqiqalik muddati tugadi. Iltimos, o\'rindiqni qayta tanlang.',
        [{ text: 'Yangilash', onPress: () => setSecondsLeft(600) }]
      );
      return;
    }

    if (selectedSeats.length === 0) {
      Haptics.warning();
      Alert.alert(
        'O\'rindiq tanlanmadi',
        'Iltimos, avtomobil salon sxemasidan kamida bitta o\'rindiqni tanlang.'
      );
      return;
    }

    if (!passengerName.trim() || !passengerPhone.trim()) {
      Haptics.warning();
      Alert.alert(
        'Ma\'lumotlar to\'liq emas',
        'Iltimos, ismingiz va telefon raqamingizni kiriting.'
      );
      return;
    }

    if (trip.isInternational) {
      if (!passportNumber.trim()) {
        Haptics.warning();
        Alert.alert(
          'Xorijiy pasport talab qilinadi',
          'Xalqaro reyslarda chegara nazoratidan o\'tish uchun xorijiy pasport seriyasi va raqami kiritilishi shart.'
        );
        return;
      }

      if (!checklistAcknowledged && checkedRequiredCount < totalRequiredChecklist) {
        Haptics.warning();
        Alert.alert(
          'Chegara talablarini tasdiqlang',
          'Xalqaro chegarada muammoga duch kelmaslik uchun barcha majburiy talablarni ko\'zdan kechiring.',
          [
            {
              text: 'Chek-listni ochish',
              onPress: () => setChecklistVisible(true),
            },
            {
              text: 'Baribir davom etish',
              style: 'destructive',
              onPress: () => proceedBooking(),
            },
          ]
        );
        return;
      }
    }

    proceedBooking();
  };

  const proceedBooking = () => {
    Haptics.success();
    const newBooking = bookTrip({
      tripId: trip.id,
      seatNumbers: selectedSeats,
      passengerName,
      passengerPhone,
      passengerPassport: trip.isInternational ? passportNumber : undefined,
      paymentProvider,
    });

    Alert.alert(
      'Muvaffaqiyatli band qilindi! 🎉',
      `Sizning 4 xonali bort kodingiz: #${newBooking.verificationCode}\n\nHaydovchi avtomobilga mindirishda ushbu kodni so'raydi. Chiptangiz "Safarlarim" bo'limida saqlanadi.`,
      [
        {
          text: 'Safarlarimga o\'tish',
          onPress: () => navigation.navigate('Bookings'),
        },
      ]
    );
  };

  const departureTimeStr = formatClockTime(trip.departureTime);
  const arrivalTimeStr = formatClockTime(trip.estimatedArrivalTime);

  return (
    <View style={styles.container}>
      <Header
        title={`${trip.originCity} ➔ ${trip.destinationCity}`}
        subtitle={trip.isInternational ? 'Xalqaro reys' : 'Shaharlararo qatnov'}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 10-Minute Hold Countdown Timer Banner */}
        <View
          style={[
            styles.timerBanner,
            secondsLeft < 120 && styles.timerBannerUrgent,
          ]}
        >
          <Timer
            size={16}
            color={secondsLeft < 120 ? COLORS.red[600] : COLORS.amber[800]}
          />
          <Text
            style={[
              styles.timerText,
              secondsLeft < 120 && styles.timerTextUrgent,
            ]}
          >
            {isExpired ? (
              'Band qilish vaqti tugadi! O\'rindiqni qayta tanlang.'
            ) : (
              <>
                Joyni vaqtinchalik saqlab turish taymeri:{' '}
                <Text style={styles.timerBold}>{formatTimer(secondsLeft)}</Text>
              </>
            )}
          </Text>
        </View>

        {/* International Border Guide Alert Card */}
        {trip.isInternational && (
          <TouchableOpacity
            style={styles.borderAlertCard}
            onPress={() => {
              Haptics.selection();
              setChecklistVisible(true);
            }}
            activeOpacity={0.88}
          >
            <View style={styles.borderAlertLeft}>
              <View style={styles.borderAlertIconCircle}>
                <Globe size={22} color={COLORS.blue[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.borderAlertBadgeRow}>
                  <Text style={styles.borderAlertTitle}>
                    Xalqaro chegara nazorati gidi
                  </Text>
                  <Badge label="Muhim" variant="international" />
                </View>
                <Text style={styles.borderAlertSubtitle}>
                  {trip.originCity} ➔ {trip.destinationCity} bo'yicha hujjatlar va talablar.
                </Text>
                <Text style={styles.borderProgressHint}>
                  Holat: {checkedRequiredCount}/{totalRequiredChecklist} tekshirildi
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={COLORS.blue[600]} />
          </TouchableOpacity>
        )}

        {/* Route Details Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Marshrut tafsilotlari</Text>
          <View style={styles.timelineRow}>
            <View style={styles.timelinePoint}>
              <Text style={styles.timelineTime}>{departureTimeStr}</Text>
              <Text style={styles.timelineCity}>{trip.originCity}</Text>
              <Text style={styles.timelineAddress}>{trip.originAddress}</Text>
            </View>

            <View style={styles.timelineMiddle}>
              <Text style={styles.durationBadgeText}>
                {Math.floor(trip.durationMinutes / 60)}s {trip.durationMinutes % 60}m
              </Text>
              <View style={styles.timelineBarContainer}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineBar} />
                <View style={[styles.timelineDot, styles.timelineDotEnd]} />
              </View>
              <Text style={styles.routeDirectText}>
                {trip.stops.length > 0
                  ? `${trip.stops.length} ta to'xtash`
                  : "To'g'ridan-to'g'ri"}
              </Text>
            </View>

            <View style={[styles.timelinePoint, { alignItems: 'flex-end' }]}>
              <Text style={styles.timelineTime}>{arrivalTimeStr}</Text>
              <Text style={styles.timelineCity}>{trip.destinationCity}</Text>
              <Text style={[styles.timelineAddress, { textAlign: 'right' }]}>
                {trip.destinationAddress}
              </Text>
            </View>
          </View>

          {/* Stops List if any */}
          {trip.stops.length > 0 && (
            <View style={styles.stopsContainer}>
              <Text style={styles.stopsHeader}>Oraliq to'xtash punktlari:</Text>
              {trip.stops.map((stop) => (
                <View key={stop.id} style={styles.stopItem}>
                  <View style={styles.stopBullet} />
                  <Text style={styles.stopText}>{stop.cityName}</Text>
                  <Text style={styles.stopTime}>
                    {formatClockTime(stop.estimatedArrival)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* SeatMap Component Integration */}
        <View style={styles.sectionCard}>
          <SeatMap
            seats={trip.seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            basePrice={trip.pricePerSeat}
          />

          <View style={styles.selectedSeatsSummary}>
            <Text style={styles.selectedSeatsLabel}>Tanlangan o'rindiqlar:</Text>
            <Text style={styles.selectedSeatsList}>
              {selectedSeats.length > 0
                ? selectedSeats
                    .map((num) => {
                      const s = trip.seats.find((x) => x.seatNumber === num);
                      return `#${num} (${s ? s.label : 'O\'rindiq'})`;
                    })
                    .join(', ')
                : 'Hech narsa tanlanmadi'}
            </Text>
          </View>
        </View>

        {/* Driver Profile & Vehicle Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Haydovchi va Avtomobil</Text>

          <View style={styles.driverRow}>
            <Image
              source={{ uri: trip.driver.photoUrl }}
              style={styles.driverPhoto}
            />
            <View style={styles.driverMainInfo}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{trip.driver.fullName}</Text>
                {trip.driver.isVerified && (
                  <Badge
                    label="Tekshirilgan haydovchi ★"
                    variant="success"
                    icon={<ShieldCheck size={11} color={COLORS.emerald[700]} />}
                  />
                )}
              </View>
              <View style={styles.driverMetaRow}>
                <Star size={13} color={COLORS.amber[500]} fill={COLORS.amber[500]} />
                <Text style={styles.driverRating}>
                  {trip.driver.rating.toFixed(2)}★
                </Text>
                <Text style={styles.driverTrips}>
                  • {trip.driver.totalTrips} ta safar
                </Text>
                <Text style={styles.driverYear}>
                  • {trip.driver.joinedYear}-yildan
                </Text>
              </View>
              <Text style={styles.driverLanguages}>
                Tillari: {trip.driver.languages.join(', ')}
              </Text>
            </View>
          </View>

          {/* Vehicle specs */}
          <View style={styles.vehicleBox}>
            <View style={styles.vehicleHeader}>
              <Car size={16} color={COLORS.gray[700]} />
              <Text style={styles.vehicleName}>
                {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.year})
              </Text>
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{trip.vehicle.licensePlate}</Text>
              </View>
            </View>

            <View style={styles.amenitiesGrid}>
              {trip.vehicle.hasAirConditioner && (
                <View style={styles.amenityItem}>
                  <Wind size={14} color={COLORS.emerald[600]} />
                  <Text style={styles.amenityText}>Konditsioner mavjud</Text>
                </View>
              )}
              {trip.allowLuggage && (
                <View style={styles.amenityItem}>
                  <Luggage size={14} color={COLORS.gray[600]} />
                  <Text style={styles.amenityText}>Yuk uchun keng bagaj</Text>
                </View>
              )}
              {trip.vehicle.hasPhoneCharging && (
                <View style={styles.amenityItem}>
                  <BatteryCharging size={14} color={COLORS.blue[600]} />
                  <Text style={styles.amenityText}>USB zaryadka portlari</Text>
                </View>
              )}
              {trip.vehicle.noSmoking && (
                <View style={styles.amenityItem}>
                  <CigaretteOff size={14} color={COLORS.gray[600]} />
                  <Text style={styles.amenityText}>Salonda chekilmaydi</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Passenger Information Input Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Yo'lovchi ma'lumotlari</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>To'liq ism-familiya *</Text>
            <View style={styles.formInputWrapper}>
              <User size={16} color={COLORS.gray[400]} />
              <TextInput
                style={styles.formInput}
                value={passengerName}
                onChangeText={setPassengerName}
                placeholder="Ismingiz va familiyangiz"
                placeholderTextColor={COLORS.gray[400]}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Telefon raqam *</Text>
            <View style={styles.formInputWrapper}>
              <Phone size={16} color={COLORS.gray[400]} />
              <TextInput
                style={styles.formInput}
                value={passengerPhone}
                onChangeText={setPassengerPhone}
                placeholder="+998 90 123 45 67"
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.gray[400]}
              />
            </View>
          </View>

          {trip.isInternational && (
            <View style={styles.formGroup}>
              <View style={styles.labelWithHint}>
                <Text style={styles.formLabel}>Xorijiy pasport seriyasi va raqami *</Text>
                <Text style={styles.requiredHint}>(Chegara uchun majburiy)</Text>
              </View>
              <View style={styles.formInputWrapper}>
                <FileText size={16} color={COLORS.blue[600]} />
                <TextInput
                  style={styles.formInput}
                  value={passportNumber}
                  onChangeText={setPassportNumber}
                  placeholder="Masalan: FA1234567"
                  autoCapitalize="characters"
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Payment Method Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>To'lov usuli</Text>

          <View style={styles.paymentMethodsGrid}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentProvider === PaymentProvider.PAYME &&
                  styles.paymentOptionActive,
              ]}
              onPress={() => {
                Haptics.light();
                setPaymentProvider(PaymentProvider.PAYME);
              }}
            >
              <CreditCard
                size={18}
                color={
                  paymentProvider === PaymentProvider.PAYME
                    ? COLORS.emerald[700]
                    : COLORS.gray[500]
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentProvider === PaymentProvider.PAYME &&
                    styles.paymentOptionTextActive,
                ]}
              >
                Payme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentProvider === PaymentProvider.CLICK &&
                  styles.paymentOptionActive,
              ]}
              onPress={() => {
                Haptics.light();
                setPaymentProvider(PaymentProvider.CLICK);
              }}
            >
              <CreditCard
                size={18}
                color={
                  paymentProvider === PaymentProvider.CLICK
                    ? COLORS.emerald[700]
                    : COLORS.gray[500]
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentProvider === PaymentProvider.CLICK &&
                    styles.paymentOptionTextActive,
                ]}
              >
                Click
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentProvider === PaymentProvider.UZUM &&
                  styles.paymentOptionActive,
              ]}
              onPress={() => {
                Haptics.light();
                setPaymentProvider(PaymentProvider.UZUM);
              }}
            >
              <CreditCard
                size={18}
                color={
                  paymentProvider === PaymentProvider.UZUM
                    ? COLORS.emerald[700]
                    : COLORS.gray[500]
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentProvider === PaymentProvider.UZUM &&
                    styles.paymentOptionTextActive,
                ]}
              >
                Uzum Bank
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentProvider === PaymentProvider.CASH &&
                  styles.paymentOptionActive,
              ]}
              onPress={() => {
                Haptics.light();
                setPaymentProvider(PaymentProvider.CASH);
              }}
            >
              <Wallet
                size={18}
                color={
                  paymentProvider === PaymentProvider.CASH
                    ? COLORS.emerald[700]
                    : COLORS.gray[500]
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentProvider === PaymentProvider.CASH &&
                    styles.paymentOptionTextActive,
                ]}
              >
                Naqd pul
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>
            Jami to'lov ({selectedSeats.length} ta o'rindiq):
          </Text>
          <Text style={styles.bottomPriceAmount}>
            {totalPrice.toLocaleString('uz-UZ')}{' '}
            <Text style={styles.bottomPriceCurrency}>{trip.currency}</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            (selectedSeats.length === 0 || isExpired) && styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={selectedSeats.length === 0 || isExpired}
          activeOpacity={0.88}
        >
          <Text style={styles.bookButtonText}>Joyni band qilish</Text>
          <ArrowRight size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Border Checklist Modal */}
      <BorderChecklistModal
        visible={isChecklistVisible}
        onClose={() => setChecklistVisible(false)}
        checklist={borderChecklist}
        onConfirm={() => {
          setChecklistAcknowledged(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  timerBannerUrgent: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  timerText: {
    fontSize: 12,
    color: COLORS.amber[900],
    fontWeight: '600',
    flex: 1,
  },
  timerTextUrgent: {
    color: COLORS.red[700],
  },
  timerBold: {
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  borderAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 14,
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  borderAlertLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  borderAlertIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderAlertBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  borderAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  borderAlertSubtitle: {
    fontSize: 11,
    color: '#3B82F6',
  },
  borderProgressHint: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emerald[700],
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  timelinePoint: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.gray[900],
    fontVariant: ['tabular-nums'],
  },
  timelineCity: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray[800],
    marginTop: 2,
  },
  timelineAddress: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 1,
  },
  timelineMiddle: {
    alignItems: 'center',
    paddingHorizontal: 8,
    minWidth: 90,
  },
  durationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  timelineBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald[600],
  },
  timelineDotEnd: {
    backgroundColor: COLORS.emerald[600],
  },
  timelineBar: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.gray[300],
  },
  routeDirectText: {
    fontSize: 10,
    color: COLORS.emerald[700],
    fontWeight: '600',
    marginTop: 4,
  },
  stopsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    gap: 6,
  },
  stopsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.emerald[600],
  },
  stopText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray[700],
    flex: 1,
  },
  stopTime: {
    fontSize: 11,
    color: COLORS.gray[400],
    fontVariant: ['tabular-nums'],
  },
  selectedSeatsSummary: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedSeatsLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  selectedSeatsList: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[700],
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  driverPhoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.gray[200],
  },
  driverMainInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  driverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  driverRating: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  driverTrips: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  driverYear: {
    fontSize: 12,
    color: COLORS.gray[400],
  },
  driverLanguages: {
    fontSize: 11,
    color: COLORS.gray[500],
  },
  vehicleBox: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[800],
    flex: 1,
  },
  plateBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  plateText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amenityText: {
    fontSize: 11,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 12,
  },
  labelWithHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 4,
  },
  requiredHint: {
    fontSize: 10,
    color: COLORS.red[600],
    fontWeight: '600',
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  formInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray[900],
    fontWeight: '600',
    padding: 0,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  paymentOption: {
    flex: 1,
    minWidth: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.gray[50],
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    paddingVertical: 10,
  },
  paymentOptionActive: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[600],
  },
  paymentOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[700],
  },
  paymentOptionTextActive: {
    color: COLORS.emerald[800],
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    ...SHADOWS.lg,
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  bottomPriceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.emerald[700],
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  bottomPriceCurrency: {
    fontSize: 13,
    fontWeight: '700',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.emerald[600],
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  bookButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
