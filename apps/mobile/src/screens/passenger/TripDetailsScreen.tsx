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
import { SeatMap } from '../../components/SeatMap';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import { RouteMap } from '../../components/RouteMap';
import { Haptics } from '../../components/ui/Haptics';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PriceDisplay } from '../../components/ui/PriceDisplay';
import { EmptyState } from '../../components/ui/EmptyState';
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
    if (!trip || !trip.seats) return [];
    const seat1 = trip.seats.find((s) => s.seatNumber === 1 && s.isAvailable);
    if (seat1) return [1];
    const firstAvail = trip.seats.find((s) => s.isAvailable);
    return firstAvail ? [firstAvail.seatNumber] : [];
  }, [trip?.seats]);

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
    if (!trip || !trip.seats) return 0;
    return selectedSeats.reduce((sum, seatNum) => {
      const seat = trip.seats.find((s) => s.seatNumber === seatNum);
      const delta = seat ? seat.priceDelta : 0;
      return sum + trip.pricePerSeat + delta;
    }, 0);
  }, [selectedSeats, trip?.seats, trip?.pricePerSeat]);

  // Border checklist stats
  const borderChecklist = useMemo(() => {
    if (!trip) return getBorderChecklist(CountryCode.UZ, CountryCode.KZ);
    return getBorderChecklist(trip.originCountry, trip.destinationCountry);
  }, [trip?.originCountry, trip?.destinationCountry]);

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
      'Muvaffaqiyatli band qilindi!',
      `Sizning 4 xonali tasdiqlash kodingiz: #${newBooking.verificationCode}\n\nHaydovchi avtomobilga chiqishingizda ushbu kodni so'raydi. Chiptangiz "Safarlarim" bo'limida saqlanadi.`,
      [
        {
          text: 'Safarlarimga o\'tish',
          onPress: () => navigation.navigate('Bookings'),
        },
      ]
    );
  };

  if (!trip) {
    return (
      <View style={styles.container}>
        <Header title="Reys tafsilotlari" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <EmptyState
            title="Reys topilmadi"
            description="Bunday reys mavjud emas yoki muddati o'tib ketgan."
            actionTitle="Orqaga qaytish"
            onActionPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  const isWhenFull = trip.departureType === 'WHEN_FULL';
  const departureTimeStr = isWhenFull ? "To'lganda" : formatClockTime(trip.departureTime);
  const arrivalTimeStr = isWhenFull ? `~${Math.round(trip.durationMinutes / 60)} soat` : formatClockTime(trip.estimatedArrivalTime);

  return (
    <View style={styles.container}>
      <Header
        title={`${trip.originCity} ➔ ${trip.destinationCity}`}
        subtitle={
          isWhenFull
            ? 'To’lsa jo’naydi (Jonli reys)'
            : trip.isInternational
            ? 'Xalqaro reys'
            : 'Shaharlararo qatnov'
        }
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
                  <Text style={styles.importantText}>Muhim</Text>
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

        {/* Interactive Highway Corridor & Route Map */}
        <RouteMap
          originCity={trip.originCity}
          destinationCity={trip.destinationCity}
          isInternational={trip.isInternational}
          borderName={trip.isInternational ? "G'isht-Ko'prik / Chernyayevka" : undefined}
          borderWaitMinutes={trip.isInternational ? 25 : undefined}
          progressPercent={0}
          themeMode="dark"
          estimatedDurationMinutes={trip.durationMinutes}
          onPressBorder={() => {
            if (trip.isInternational) {
              setChecklistVisible(true);
            }
          }}
        />

        {/* Route Details Card */}
        <Card variant="surface" style={styles.sectionCard}>
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
                {isWhenFull
                  ? "To'lganda jo'naydi"
                  : trip.stops.length > 0
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
        </Card>

        {/* SeatMap Component Integration */}
        <Card variant="surface" style={styles.sectionCard}>
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
        </Card>

        {/* Driver Profile & Vehicle Card */}
        <Card variant="surface" style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Haydovchi va Avtomobil</Text>

          <View style={styles.driverRow}>
            <Avatar
              name={trip.driver.fullName}
              photoUrl={trip.driver.photoUrl}
              size="lg"
              isVerified={trip.driver.isVerified}
            />
            <View style={styles.driverMainInfo}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{trip.driver.fullName}</Text>
                {trip.driver.isVerified && (
                  <Badge variant="success" label="Tekshirilgan" size="sm" />
                )}
              </View>
              <View style={styles.driverMetaRow}>
                <Star size={13} color={COLORS.amber[500]} fill={COLORS.amber[500]} />
                <Text style={styles.driverRating}>
                  {trip.driver.rating.toFixed(2)}
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
              {trip.vehicle.trunkCapacity === 'LIMITED' ? (
                <View style={styles.amenityItem}>
                  <Luggage size={14} color="#F59E0B" />
                  <Text style={styles.amenityText}>Kichik bagaj (Metan gaz)</Text>
                </View>
              ) : trip.vehicle.trunkCapacity === 'LARGE' || trip.allowLuggage ? (
                <View style={styles.amenityItem}>
                  <Luggage size={14} color="#10B981" />
                  <Text style={styles.amenityText}>Katta bagaj (Bo’sh yukxona)</Text>
                </View>
              ) : null}
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
        </Card>

        {/* Passenger Information Input Form */}
        <Card variant="surface" style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Yo'lovchi ma'lumotlari</Text>

          <Input
            label="To'liq ism-familiya *"
            value={passengerName}
            onChangeText={setPassengerName}
            placeholder="Ismingiz va familiyangiz"
            leftIcon={<User size={16} color={COLORS.gray[400]} />}
            containerStyle={{ marginBottom: 14 }}
          />

          <Input
            label="Telefon raqam *"
            value={passengerPhone}
            onChangeText={setPassengerPhone}
            placeholder="+998 90 123 45 67"
            keyboardType="phone-pad"
            leftIcon={<Phone size={16} color={COLORS.gray[400]} />}
            containerStyle={{ marginBottom: 14 }}
          />

          {trip.isInternational && (
            <Input
              label="Xorijiy pasport seriyasi va raqami *"
              hint="Chegara nazorati uchun majburiy"
              value={passportNumber}
              onChangeText={setPassportNumber}
              placeholder="Masalan: FA1234567"
              autoCapitalize="characters"
              leftIcon={<FileText size={16} color={COLORS.blue[400]} />}
              containerStyle={{ marginBottom: 14 }}
            />
          )}
        </Card>

        {/* Payment Method Selector */}
        <Card variant="surface" style={styles.sectionCard}>
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
                    ? '#FFFFFF'
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
                    ? '#FFFFFF'
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
                    ? '#FFFFFF'
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
                    ? '#FFFFFF'
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
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>
            Jami to'lov ({selectedSeats.length} ta o'rindiq):
          </Text>
          <PriceDisplay
            amount={totalPrice}
            currency={trip.currency}
            size="lg"
          />
        </View>

        <Button
          variant="primary"
          size="lg"
          title="Joyni band qilish"
          disabled={selectedSeats.length === 0 || isExpired}
          onPress={handleBooking}
          rightIcon={<ArrowRight size={16} color="#0C0D11" strokeWidth={2.8} />}
          style={{ minWidth: 170 }}
        />
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
    backgroundColor: '#0C0D11',
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
    backgroundColor: 'rgba(255, 136, 0, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.35)',
    marginBottom: 12,
  },
  timerBannerUrgent: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  timerText: {
    fontSize: 12,
    color: '#FFA033',
    fontWeight: '600',
    flex: 1,
  },
  timerTextUrgent: {
    color: '#F87171',
  },
  timerBold: {
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: '#FF8800',
  },
  borderAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15171E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 14,
    marginBottom: 14,
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
    backgroundColor: '#1D2029',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  borderAlertBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  importantText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  borderAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  borderAlertSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  borderProgressHint: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF8800',
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: '#15171E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 16,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
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
    fontWeight: '900',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  timelineCity: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  timelineAddress: {
    fontSize: 11,
    color: '#94A3B8',
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
    color: '#94A3B8',
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
    backgroundColor: '#FF8800',
  },
  timelineDotEnd: {
    backgroundColor: '#FF8800',
  },
  timelineBar: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#272B35',
  },
  routeDirectText: {
    fontSize: 10,
    color: '#FF8800',
    fontWeight: '700',
    marginTop: 4,
  },
  stopsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E222A',
    gap: 6,
  },
  stopsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
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
    backgroundColor: '#FF8800',
  },
  stopText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    flex: 1,
  },
  stopTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontVariant: ['tabular-nums'],
  },
  selectedSeatsSummary: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E222A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedSeatsLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  selectedSeatsList: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF8800',
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
    backgroundColor: '#1D2029',
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
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
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
    color: '#FF8800',
  },
  driverTrips: {
    fontSize: 12,
    color: '#94A3B8',
  },
  driverYear: {
    fontSize: 12,
    color: '#64748B',
  },
  driverLanguages: {
    fontSize: 11,
    color: '#94A3B8',
  },
  vehicleBox: {
    backgroundColor: '#11141B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#272B35',
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
    color: '#FFFFFF',
    flex: 1,
  },
  plateBadge: {
    backgroundColor: '#1D2029',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  plateText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF8800',
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
    color: '#94A3B8',
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
    color: '#CBD5E1',
    marginBottom: 4,
  },
  requiredHint: {
    fontSize: 10,
    color: '#F87171',
    fontWeight: '600',
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0D11',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  formInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
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
    backgroundColor: '#0C0D11',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingVertical: 10,
  },
  paymentOptionActive: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
  },
  paymentOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  paymentOptionTextActive: {
    color: '#0C0D11',
    fontWeight: '900',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#15171E',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#272B35',
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  bottomPriceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  bottomPriceCurrency: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF9E2C',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF8800',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  bookButtonDisabled: {
    backgroundColor: '#272B35',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0C0D11',
  },
});
