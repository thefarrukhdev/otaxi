import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { SeatMap } from '../../components/SeatMap';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import { useApp } from '../../context/AppContext';
import { getBorderChecklist } from '../../lib/data';
import { PaymentProvider } from '@otaxi/types';
import {
  Star,
  ShieldCheck,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Car,
  Wind,
  Luggage,
  CigaretteOff,
  BatteryCharging,
  CreditCard,
  ShieldAlert,
  CheckCircle,
  Timer,
} from 'lucide-react-native';

interface TripDetailsScreenProps {
  navigation: any;
  route: any;
}

export const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({ navigation, route }) => {
  const { trips, bookTrip } = useApp();
  const tripId = route.params?.tripId;
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  const [selectedSeats, setSelectedSeats] = useState<number[]>([1]);
  const [passengerName, setPassengerName] = useState('Farrukh Bek');
  const [passengerPhone, setPassengerPhone] = useState('+998 90 999 88 11');
  const [passportNumber, setPassportNumber] = useState('FA1234567');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>(PaymentProvider.PAYME);
  const [isChecklistVisible, setChecklistVisible] = useState(false);

  // 10-minute hold countdown timer simulation
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleToggleSeat = (seatNum: number) => {
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((sum, seatNum) => {
      const seat = trip.seats.find((s) => s.seatNumber === seatNum);
      const delta = seat ? seat.priceDelta : 0;
      return sum + trip.pricePerSeat + delta;
    }, 0);
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Joy tanlanmadi', 'Iltimos, avtomobil sxemasidan kamida bitta o’rindiqni tanlang.');
      return;
    }

    if (!passengerName.trim() || !passengerPhone.trim()) {
      Alert.alert('Ma’lumotlar to’liq emas', 'Iltimos, ismingiz va telefon raqamingizni kiriting.');
      return;
    }

    if (trip.isInternational && !passportNumber.trim()) {
      Alert.alert(
        'Xorijiy pasport talab qilinadi',
        'Xalqaro reyslarda chegara nazoratidan o’tish uchun xorijiy pasport seriyasi va raqami kiritilishi shart.'
      );
      return;
    }

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
      `Sizning bortga chiqish kodingiz: #${newBooking.verificationCode}. Ushbu kodni haydovchiga ko’rsatib safarga chiqishingiz mumkin.`,
      [
        {
          text: 'Safarlarimga o’tish',
          onPress: () => navigation.navigate('Bookings'),
        },
      ]
    );
  };

  const checklistData = getBorderChecklist(trip.originCountry, trip.destinationCountry);

  return (
    <View style={styles.container}>
      <Header
        title={`${trip.originCity} ➔ ${trip.destinationCity}`}
        subtitle={trip.isInternational ? 'Xalqaro reys' : 'Shaharlararo qatnov'}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Reservation 10-min Timer Banner */}
        <View style={styles.timerBanner}>
          <Timer size={16} color={COLORS.amber[700]} />
          <Text style={styles.timerText}>
            Joyni vaqtinchalik band qilish taymeri: <Text style={styles.timerBold}>{formatTimer(secondsLeft)}</Text>
          </Text>
        </View>

        {/* International Border Alert Banner (PRD PAS-11) */}
        {trip.isInternational && (
          <TouchableOpacity
            style={styles.borderAlertCard}
            onPress={() => setChecklistVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.borderAlertIcon}>
              <ShieldAlert size={24} color={COLORS.blue[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.borderAlertTitle}>Xalqaro chegara nazorati</Text>
                <Badge label="PRD PAS-11" variant="blue" />
              </View>
              <Text style={styles.borderAlertDesc}>
                Ushbu reys davlat chegarasini kesib o’tadi. Xorijiy pasport, vizasiz qoidalar va bolalar ruxsatnomasini tekshiring.
              </Text>
              <Text style={styles.borderAlertLink}>Chek-listni ko’rish va belgilash ➔</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Route Stops & Times Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Marshrut va to’xtash joylari</Text>
          <View style={styles.stopTimeline}>
            <View style={styles.stopItem}>
              <View style={[styles.stopDot, { backgroundColor: COLORS.emerald[600] }]} />
              <View style={styles.stopContent}>
                <Text style={styles.stopCity}>{trip.originCity}</Text>
                <Text style={styles.stopAddress}>{trip.originAddress}</Text>
                <Text style={styles.stopTime}>
                  Jo'nash: {new Date(trip.departureTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>

            {trip.stops.map((stop, idx) => (
              <View key={stop.id} style={styles.stopItem}>
                <View style={[styles.stopDot, { backgroundColor: COLORS.blue[500] }]} />
                <View style={styles.stopContent}>
                  <Text style={styles.stopCity}>{stop.cityName}</Text>
                  <Text style={styles.stopTime}>
                    Taxminiy yetib borish: {new Date(stop.estimatedArrival).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.stopItem}>
              <View style={[styles.stopDot, { backgroundColor: COLORS.amber[500] }]} />
              <View style={styles.stopContent}>
                <Text style={styles.stopCity}>{trip.destinationCity}</Text>
                <Text style={styles.stopAddress}>{trip.destinationAddress}</Text>
                <Text style={styles.stopTime}>
                  Yetib borish: {new Date(trip.estimatedArrivalTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Haydovchi haqida</Text>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.avatarText}>{trip.driver.fullName.slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.driverName}>{trip.driver.fullName}</Text>
                {trip.driver.isVerified && (
                  <ShieldCheck size={16} color={COLORS.emerald[600]} />
                )}
              </View>
              <View style={styles.ratingRow}>
                <Star size={14} color="#eab308" fill="#eab308" />
                <Text style={styles.ratingText}>{trip.driver.rating.toFixed(2)}</Text>
                <Text style={styles.subtleText}>
                  • {trip.driver.totalTrips} ta safar • {trip.driver.joinedYear}-yildan
                </Text>
              </View>
              <Text style={styles.languagesText}>
                Tillar: {trip.driver.languages.join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.verifiedNotice}>
            <CheckCircle size={14} color={COLORS.emerald[700]} />
            <Text style={styles.verifiedNoticeText}>
              OTAXI xavfsizlik tekshiruvidan to'liq o'tgan: Haydovchilik guvohnomasi, texpasport va sug'urta tasdiqlangan.
            </Text>
          </View>
        </View>

        {/* Vehicle Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Avtomobil va qulayliklar</Text>
          <View style={styles.vehicleInfoRow}>
            <Car size={24} color={COLORS.gray[700]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleTitle}>
                {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.year})
              </Text>
              <Text style={styles.vehiclePlate}>
                Davlat raqami: {trip.vehicle.licensePlate} • Rangi: {trip.vehicle.color}
              </Text>
            </View>
          </View>

          <View style={styles.amenitiesGrid}>
            {trip.vehicle.hasAirConditioner && (
              <View style={styles.amenityItem}>
                <Wind size={14} color={COLORS.emerald[700]} />
                <Text style={styles.amenityText}>Konditsioner</Text>
              </View>
            )}
            {trip.allowLuggage && (
              <View style={styles.amenityItem}>
                <Luggage size={14} color={COLORS.emerald[700]} />
                <Text style={styles.amenityText}>Katta yukxona</Text>
              </View>
            )}
            {trip.vehicle.noSmoking && (
              <View style={styles.amenityItem}>
                <CigaretteOff size={14} color={COLORS.emerald[700]} />
                <Text style={styles.amenityText}>Chekish taqiqlangan</Text>
              </View>
            )}
            {trip.vehicle.hasPhoneCharging && (
              <View style={styles.amenityItem}>
                <BatteryCharging size={14} color={COLORS.emerald[700]} />
                <Text style={styles.amenityText}>Telefon quvvatlagich</Text>
              </View>
            )}
          </View>
        </View>

        {/* Interactive Car Seat Selection */}
        <View style={styles.card}>
          <SeatMap
            seats={trip.seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            basePrice={trip.pricePerSeat}
          />
        </View>

        {/* Passenger Info Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yo’lovchi ma’lumotlari</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Ism va familiya</Text>
            <TextInput
              style={styles.formInput}
              value={passengerName}
              onChangeText={setPassengerName}
              placeholder="Farrukh Bek"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Telefon raqami</Text>
            <TextInput
              style={styles.formInput}
              value={passengerPhone}
              onChangeText={setPassengerPhone}
              placeholder="+998 90 123 45 67"
              keyboardType="phone-pad"
            />
          </View>

          {trip.isInternational && (
            <View style={styles.formGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.formLabel}>Xorijiy pasport seriya va raqami</Text>
                <Text style={styles.requiredLabel}>Majburiy</Text>
              </View>
              <TextInput
                style={styles.formInput}
                value={passportNumber}
                onChangeText={setPassportNumber}
                placeholder="FA1234567"
                autoCapitalize="characters"
              />
              <Text style={styles.formHint}>
                Chegara bojxona qoidalariga binoan xalqaro reyslarda talab etiladi.
              </Text>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>To’lov usulini tanlang</Text>
          <View style={styles.paymentMethodsRow}>
            {[
              { id: PaymentProvider.PAYME, name: 'Payme' },
              { id: PaymentProvider.CLICK, name: 'Click' },
              { id: PaymentProvider.UZUM, name: 'Uzum Bank' },
            ].map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.paymentOption,
                  paymentProvider === p.id && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentProvider(p.id)}
              >
                <CreditCard
                  size={16}
                  color={paymentProvider === p.id ? COLORS.emerald[700] : COLORS.gray[400]}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentProvider === p.id && styles.paymentOptionTextActive,
                  ]}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerPriceCol}>
          <Text style={styles.footerPriceLabel}>
            Jami to’lov ({selectedSeats.length} ta o'rindiq):
          </Text>
          <Text style={styles.footerPriceAmount}>
            {calculateTotalPrice().toLocaleString('uz-UZ')} UZS
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, selectedSeats.length === 0 && styles.bookBtnDisabled]}
          disabled={selectedSeats.length === 0}
          onPress={handleBooking}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>Joyni band qilish</Text>
        </TouchableOpacity>
      </View>

      {/* Border Checklist Modal */}
      <BorderChecklistModal
        visible={isChecklistVisible}
        onClose={() => setChecklistVisible(false)}
        checklist={checklistData}
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
    backgroundColor: COLORS.amber[50],
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.amber[200],
    gap: 8,
    marginBottom: 12,
  },
  timerText: {
    fontSize: 12,
    color: COLORS.amber[900],
    flex: 1,
  },
  timerBold: {
    fontWeight: '900',
    color: COLORS.amber[800],
  },
  borderAlertCard: {
    backgroundColor: COLORS.blue[50],
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.blue[200],
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  borderAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderAlertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.blue[900],
  },
  borderAlertDesc: {
    fontSize: 11,
    color: COLORS.blue[800],
    lineHeight: 16,
    marginVertical: 4,
  },
  borderAlertLink: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.blue[600],
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  stopTimeline: {
    marginLeft: 6,
  },
  stopItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  stopContent: {
    flex: 1,
  },
  stopCity: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  stopAddress: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 1,
  },
  stopTime: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald[700],
    marginTop: 2,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 16,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  subtleText: {
    fontSize: 11,
    color: COLORS.gray[500],
  },
  languagesText: {
    fontSize: 11,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  verifiedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emerald[50],
    padding: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  verifiedNoticeText: {
    fontSize: 11,
    color: COLORS.emerald[900],
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  vehiclePlate: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  amenityText: {
    fontSize: 11,
    color: COLORS.gray[700],
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 4,
  },
  requiredLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.red[600],
  },
  formInput: {
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  formHint: {
    fontSize: 10,
    color: COLORS.gray[500],
    marginTop: 4,
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[50],
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  paymentOptionActive: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[600],
  },
  paymentOptionText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.gray[700],
  },
  paymentOptionTextActive: {
    color: COLORS.emerald[800],
  },
  stickyFooter: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.lg,
  },
  footerPriceCol: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 11,
    color: COLORS.gray[400],
    fontWeight: '700',
  },
  footerPriceAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.emerald[700],
  },
  bookBtn: {
    backgroundColor: COLORS.emerald[600],
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    ...SHADOWS.md,
  },
  bookBtnDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  bookBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
