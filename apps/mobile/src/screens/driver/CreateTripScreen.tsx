import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { Haptics } from '../../components/ui/Haptics';
import { Button, Card, Input, SegmentedControl, Badge } from '../../components/ui';
import {
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  CreditCard,
  Globe,
  ShieldAlert,
  Wind,
  Luggage,
  CigaretteOff,
  BatteryCharging,
  CheckCircle,
  X,
  Plus,
  Zap,
  Calculator,
} from 'lucide-react-native';

interface CreateTripScreenProps {
  navigation: any;
}

interface CorridorPreset {
  from: string;
  to: string;
  isInternational: boolean;
  price: number;
  pickup: string;
  dropoff: string;
  stops: string[];
}

const POPULAR_CORRIDORS: CorridorPreset[] = [
  {
    from: 'Toshkent',
    to: 'Samarqand',
    isInternational: false,
    price: 90000,
    pickup: 'Olmazor metro bekati',
    dropoff: 'Markaziy Registon shoxbekati',
    stops: ['Jizzax'],
  },
  {
    from: 'Toshkent',
    to: 'Shymkent',
    isInternational: true,
    price: 120000,
    pickup: 'Sobir Rahimov / G’ishtko’prik posti',
    dropoff: 'Kolos avtovokzali, Shymkent',
    stops: ['G’ishtko’prik chegara posti'],
  },
  {
    from: 'Toshkent',
    to: 'Andijon',
    isInternational: false,
    price: 110000,
    pickup: 'Qo’yliq bozori bekati',
    dropoff: 'Yangi bozor avtostansiya',
    stops: ['Qo’qon', 'Namangan burilishi'],
  },
  {
    from: 'Toshkent',
    to: 'Bishkek',
    isInternational: true,
    price: 250000,
    pickup: 'Shimoliy vokzal maydoni',
    dropoff: 'Glavniy avtovokzal, Bishkek',
    stops: ['Shymkent aylanma', 'Korday chegara posti'],
  },
];

const TIME_PRESETS = [
  'Bugun, 18:30',
  'Ertaga, 06:00',
  'Ertaga, 08:30',
  'Ertaga, 14:00',
];

export const CreateTripScreen: React.FC<CreateTripScreenProps> = ({ navigation }) => {
  const { createDriverTrip } = useApp();

  const [isInternational, setIsInternational] = useState(false);
  const [originCity, setOriginCity] = useState('Toshkent');
  const [originAddress, setOriginAddress] = useState('Olmazor metro bekati, avtoshoxbekat');
  const [destinationCity, setDestinationCity] = useState('Samarqand');
  const [destinationAddress, setDestinationAddress] = useState('Markaziy Registon shoxbekati');
  const [departureTime, setDepartureTime] = useState('Ertaga, 07:00');
  const [departureType, setDepartureType] = useState<'WHEN_FULL' | 'SCHEDULED'>('WHEN_FULL');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seatsCount, setSeatsCount] = useState<number>(4);
  const [pricePerSeat, setPricePerSeat] = useState<string>('90000');
  const [hasVIPFrontSeat, setHasVIPFrontSeat] = useState<boolean>(true);
  const [stops, setStops] = useState<string[]>(['Jizzax']);
  const [newStopInput, setNewStopInput] = useState<string>('');
  const [notes, setNotes] = useState<string>(
    'Konditsionerli yangi Chevrolet Malibu, qulay va tez safar. Katta bagaj joyi mavjud.'
  );

  // Amenities
  const [hasAC, setHasAC] = useState(true);
  const [hasLuggage, setHasLuggage] = useState(true);
  const [noSmoking, setNoSmoking] = useState(true);
  const [hasCharging, setHasCharging] = useState(true);

  const parsedPrice = parseInt(pricePerSeat.replace(/\D/g, ''), 10) || 0;
  const vipBonus = hasVIPFrontSeat ? 15000 : 0;
  const estimatedGrossRevenue = parsedPrice * seatsCount + vipBonus;
  const platformFee = Math.round(estimatedGrossRevenue * 0.1);
  const estimatedNetEarnings = estimatedGrossRevenue - platformFee;

  const handleSelectCorridor = (corridor: CorridorPreset) => {
    Haptics.selection();
    setIsInternational(corridor.isInternational);
    setOriginCity(corridor.from);
    setDestinationCity(corridor.to);
    setOriginAddress(corridor.pickup);
    setDestinationAddress(corridor.dropoff);
    setPricePerSeat(corridor.price.toString());
    setStops(corridor.stops);
  };

  const handleAddStop = () => {
    const trimmed = newStopInput.trim();
    if (trimmed) {
      Haptics.light();
      setStops((prev) => [...prev, trimmed]);
      setNewStopInput('');
    }
  };

  const handleRemoveStop = (idx: number) => {
    Haptics.light();
    setStops((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = () => {
    if (!originCity.trim() || !destinationCity.trim()) {
      Haptics.warning();
      Alert.alert('Xato', 'Iltimos, jo’nash va yetib borish shaharlarini to’liq kiriting.');
      return;
    }

    if (parsedPrice < 10000) {
      Haptics.warning();
      Alert.alert('Xato', 'O’rindiq narxi kamida 10,000 UZS bo’lishi shart.');
      return;
    }

    createDriverTrip({
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      departureTime: departureType === 'WHEN_FULL' ? "To'lganda jo'naydi" : departureTime,
      departureType,
      totalSeats: seatsCount,
      availableSeats: seatsCount,
      pricePerSeat: parsedPrice,
      isInternational,
      notes,
    });

    Haptics.success();
    Alert.alert(
      'Reys muvaffaqiyatli e’lon qilindi!',
      `${originCity} ➔ ${destinationCity} yo’nalishidagi reysingiz e’lon qilindi. ${seatsCount} ta o’rindiq yo’lovchilar uchun ochiq. Yo’lovchilar buyurtma berganda xabar beramiz.`,
      [
        {
          text: 'Boshqaruv paneliga o’tish',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Yangi reys e’lon qilish"
        subtitle="Shaharlararo yoki xalqaro chegara qatnovi"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Route Type Toggle */}
        <Card variant="surface" style={styles.card}>
          <Text style={styles.cardLabel}>Safar turi (Qatnov geografiyasi)</Text>
          <SegmentedControl
            items={[
              {
                id: 'local',
                label: 'Shaharlararo reys',
                icon: <Car size={16} color={!isInternational ? '#0C0D11' : '#94A3B8'} />,
              },
              {
                id: 'international',
                label: 'Xalqaro reys',
                icon: <Globe size={16} color={isInternational ? '#0C0D11' : '#94A3B8'} />,
              },
            ]}
            selectedId={isInternational ? 'international' : 'local'}
            onSelect={(id) => setIsInternational(id === 'international')}
          />

          {isInternational && (
            <View style={styles.internationalAlert}>
              <ShieldAlert size={16} color="#FF8800" />
              <Text style={styles.internationalAlertText}>
                Xalqaro reyslarda yo’lovchilarga OTAXI chegara chek-listi (PAS-11) avtomatik ko’rsatiladi va haydovchidan chet elga chiqish xorijiy pasporti talab qilinadi.
              </Text>
            </View>
          )}
        </Card>

        {/* Popular Corridors Quick-Select */}
        <Card variant="surface" style={styles.card}>
          <Text style={styles.cardLabel}>Mashhur yo’nalishlar (Tezkor tanlov)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.corridorScroll}>
            {POPULAR_CORRIDORS.map((c, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.corridorChip}
                onPress={() => handleSelectCorridor(c)}
                activeOpacity={0.8}
              >
                <Text style={styles.corridorChipRoute}>
                  {c.from} ➔ {c.to}
                </Text>
                <Text style={styles.corridorChipPrice}>
                  {c.price.toLocaleString('uz-UZ')} UZS
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Route Cities & Pick-up points */}
        <Card variant="surface" style={styles.card}>
          <Text style={styles.cardLabel}>Yo’nalish va bekatlar</Text>

          {/* Origin */}
          <Input
            label="Jo'nash shahri"
            value={originCity}
            onChangeText={setOriginCity}
            placeholder="Toshkent"
            leftIcon={<MapPin size={16} color={COLORS.emerald[400]} />}
            containerStyle={{ marginBottom: 12 }}
          />

          <Input
            label="Jo'nash aniq manzili / bekat"
            value={originAddress}
            onChangeText={setOriginAddress}
            placeholder="Masalan: Olmazor metro bekati, avtoshoxbekat"
            containerStyle={{ marginBottom: 14 }}
          />

          {/* Destination */}
          <Input
            label="Yetib borish shahri"
            value={destinationCity}
            onChangeText={setDestinationCity}
            placeholder="Samarqand / Shymkent"
            leftIcon={<MapPin size={16} color="#FF8800" />}
            containerStyle={{ marginBottom: 12 }}
          />

          <Input
            label="Yetib borish manzili"
            value={destinationAddress}
            onChangeText={setDestinationAddress}
            placeholder="Masalan: Registon maydoni / Kolos bekati"
            containerStyle={{ marginBottom: 4 }}
          />
        </Card>

        {/* Date & Departure Mode Selection */}
        <Card variant="surface" style={styles.card}>
          <Text style={styles.cardLabel}>Jo’nash tartibi (Rejim)</Text>
          <SegmentedControl
            items={[
              {
                id: 'WHEN_FULL',
                label: "To'lsa jo'naymiz (Jonli)",
                icon: <Zap size={16} color={departureType === 'WHEN_FULL' ? '#0C0D11' : '#94A3B8'} />,
              },
              {
                id: 'SCHEDULED',
                label: "Aniq vaqt bo'yicha",
                icon: <Clock size={16} color={departureType === 'SCHEDULED' ? '#0C0D11' : '#94A3B8'} />,
              },
            ]}
            selectedId={departureType}
            onSelect={(id) => setDepartureType(id as 'WHEN_FULL' | 'SCHEDULED')}
          />

          {departureType === 'WHEN_FULL' ? (
            <View style={styles.whenFullNoteBox}>
              <Text style={styles.whenFullNoteText}>
                Eslatma: Jonli reys — Bekatda turibsiz. 4 ta yo’lovchi buyurtma berishi bilanoq darhol safarga chiqiladi.
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 14 }}>
              <View style={styles.timePresetsRow}>
                {TIME_PRESETS.map((t, idx) => {
                  const isSelected = departureTime === t;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.timePresetChip, isSelected && styles.timePresetChipActive]}
                      onPress={() => {
                        Haptics.selection();
                        setDepartureTime(t);
                      }}
                      activeOpacity={0.8}
                    >
                      <Clock
                        size={12}
                        color={isSelected ? '#FF8800' : '#94A3B8'}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[styles.timePresetText, isSelected && styles.timePresetTextActive]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Input
                label="Sana va vaqt"
                value={departureTime}
                onChangeText={setDepartureTime}
                placeholder="Sana va vaqt (masalan: Ertaga, 07:00)"
                leftIcon={<Calendar size={16} color="#FF8800" />}
                containerStyle={{ marginTop: 10 }}
              />
            </View>
          )}
        </Card>

        {/* Seat Count & Pricing */}
        <Card variant="surface" style={styles.card}>
          <Text style={styles.cardLabel}>O’rindiqlar va narx belgilash</Text>

          {/* Seats Selector */}
          <Text style={styles.fieldLabel}>Mavjud bo’sh joylar soni</Text>
          <View style={styles.seatCountRow}>
            {[3, 4, 6].map((count) => {
              const isSelected = seatsCount === count;
              return (
                <TouchableOpacity
                  key={count}
                  style={[styles.seatCountBtn, isSelected && styles.seatCountBtnActive]}
                  onPress={() => {
                    Haptics.selection();
                    setSeatsCount(count);
                  }}
                  activeOpacity={0.8}
                >
                  <Users
                    size={16}
                    color={isSelected ? '#0C0D11' : '#94A3B8'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[styles.seatCountText, isSelected && styles.seatCountTextActive]}
                  >
                    {count} ta o’rindiq
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Price per seat input */}
          <Input
            label="Bitta o’rindiq narxi (UZS)"
            value={parsedPrice > 0 ? parsedPrice.toLocaleString('uz-UZ') : ''}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D/g, '');
              setPricePerSeat(cleaned);
            }}
            placeholder="90 000"
            keyboardType="number-pad"
            leftIcon={<CreditCard size={16} color="#FF8800" />}
            rightIcon={<Text style={styles.currencyBadge}>UZS / joy</Text>}
            containerStyle={{ marginBottom: 14 }}
          />

          {/* VIP Front Seat Toggle */}
          <View style={styles.toggleItemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleItemTitle}>Old VIP o’rindiq ustamasi (+15,000 UZS)</Text>
              <Text style={styles.toggleItemDesc}>
                Oldingi qulay o’rindiq uchun qo’shimcha tarif belgilanadi
              </Text>
            </View>
            <Switch
              value={hasVIPFrontSeat}
              onValueChange={(val) => {
                Haptics.light();
                setHasVIPFrontSeat(val);
              }}
              trackColor={{ false: '#1E293B', true: '#FF8800' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Live Revenue Calculator Card */}
          <Card variant="outlined" style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <Calculator size={15} color="#FF8800" />
              <Text style={styles.revenueTitle}>Kutilayotgan daromad hisob-kitobi</Text>
            </View>

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Jami chiptalar tushumi ({seatsCount} ta joy):
              </Text>
              <Text style={styles.revenueVal}>
                {estimatedGrossRevenue.toLocaleString('uz-UZ')} UZS
              </Text>
            </View>

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>OTAXI platforma komissiyasi (10%):</Text>
              <Text style={styles.revenueFee}>
                -{platformFee.toLocaleString('uz-UZ')} UZS
              </Text>
            </View>

            <View style={[styles.revenueRow, styles.revenueTotalRow]}>
              <Text style={styles.revenueTotalLabel}>Hamyoningizga tushadigan sof summa:</Text>
              <Text style={styles.revenueTotalVal}>
                {estimatedNetEarnings.toLocaleString('uz-UZ')} UZS
              </Text>
            </View>
          </Card>
        </Card>

        {/* Collapsible Advanced Settings (Oraliq bekatlar, Qulayliklar, Izoh) */}
        <TouchableOpacity
          style={styles.advancedToggleBtn}
          onPress={() => {
            Haptics.light();
            setShowAdvanced(!showAdvanced);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.advancedToggleText}>
            {showAdvanced
              ? "▲ Qo'shimcha sozlamalarni yopish"
              : "▼ Qo'shimcha sozlamalar (Oraliq bekatlar, qulayliklar, izoh)"}
          </Text>
        </TouchableOpacity>

        {showAdvanced && (
          <>
            {/* Intermediate Stops (Oraliq bekatlar) */}
            <Card variant="surface" style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardLabel}>Oraliq bekatlar (Tranzit to’xtash joylari)</Text>
                <Text style={styles.cardLabelCount}>{stops.length} ta bekat</Text>
              </View>

              {stops.map((stop, idx) => (
                <View key={idx} style={styles.stopChipRow}>
                  <View style={styles.stopNumberBadge}>
                    <Text style={styles.stopNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stopNameText}>{stop}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveStop(idx)}
                    style={styles.removeStopBtn}
                    activeOpacity={0.7}
                  >
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add Stop Input */}
              <View style={styles.addStopRow}>
                <TextInput
                  style={styles.addStopInput}
                  value={newStopInput}
                  onChangeText={setNewStopInput}
                  placeholder="Yangi bekat qo’shish (masalan: Jizzax)"
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity
                  style={styles.addStopBtn}
                  onPress={handleAddStop}
                  activeOpacity={0.8}
                >
                  <Plus size={16} color={COLORS.navy[950]} />
                  <Text style={styles.addStopBtnText}>Qo’shish</Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Vehicle Amenities Switches */}
            <Card variant="surface" style={styles.card}>
              <Text style={styles.cardLabel}>Avtomobil qulayliklari</Text>

              <View style={styles.amenityRow}>
                <View style={styles.amenityLeft}>
                  <Wind size={18} color={COLORS.emerald[400]} />
                  <Text style={styles.amenityText}>Konditsioner (Iqlim nazorati)</Text>
                </View>
                <Switch
                  value={hasAC}
                  onValueChange={setHasAC}
                  trackColor={{ false: '#1E293B', true: COLORS.emerald[500] }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.amenityRow}>
                <View style={styles.amenityLeft}>
                  <Luggage size={18} color={COLORS.amber[400]} />
                  <Text style={styles.amenityText}>Katta bagaj / yukxona</Text>
                </View>
                <Switch
                  value={hasLuggage}
                  onValueChange={setHasLuggage}
                  trackColor={{ false: '#1E293B', true: COLORS.emerald[500] }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.amenityRow}>
                <View style={styles.amenityLeft}>
                  <CigaretteOff size={18} color="#EF4444" />
                  <Text style={styles.amenityText}>Salonda chekish taqiqlangan</Text>
                </View>
                <Switch
                  value={noSmoking}
                  onValueChange={setNoSmoking}
                  trackColor={{ false: '#1E293B', true: COLORS.emerald[500] }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.amenityRow}>
                <View style={styles.amenityLeft}>
                  <BatteryCharging size={18} color="#38BDF8" />
                  <Text style={styles.amenityText}>Telefon zaryadlash (USB / Type-C)</Text>
                </View>
                <Switch
                  value={hasCharging}
                  onValueChange={setHasCharging}
                  trackColor={{ false: '#1E293B', true: COLORS.emerald[500] }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>

            {/* Trip Notes */}
            <Card variant="surface" style={styles.card}>
              <Text style={styles.cardLabel}>Yo’lovchilar uchun qo’shimcha izoh</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Qo’shimcha talablar yoki ma’lumotlar..."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={3}
              />
            </Card>
          </>
        )}

        {/* Submit Publish Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<PlusCircle size={20} color="#0C0D11" />}
          title={`Reysni e'lon qilish (${estimatedGrossRevenue.toLocaleString('uz-UZ')} UZS)`}
          onPress={handlePublish}
        />
      </ScrollView>
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
  card: {
    backgroundColor: '#15171E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#272B35',
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabelCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  typeToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#090D16',
    borderWidth: 1.5,
    borderColor: '#272B35',
    paddingVertical: 12,
    borderRadius: 12,
  },
  typeBtnActive: {
    backgroundColor: '#1E293B',
    borderColor: COLORS.amber[400],
  },
  typeBtnActiveInternational: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: COLORS.amber[400],
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  typeBtnTextActive: {
    color: '#F8FAFC',
  },
  typeBtnTextActiveInternational: {
    color: COLORS.amber[400],
    fontWeight: '800',
  },
  whenFullNoteBox: {
    backgroundColor: 'rgba(255, 136, 0, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.2)',
  },
  whenFullNoteText: {
    fontSize: 12,
    color: '#FF8800',
    lineHeight: 17,
    fontWeight: '600',
  },
  advancedToggleBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#272B35',
    alignItems: 'center',
    marginBottom: 14,
  },
  advancedToggleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FF8800',
  },
  internationalAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginTop: 12,
  },
  internationalAlertText: {
    flex: 1,
    fontSize: 11,
    color: '#E2E8F0',
    lineHeight: 16,
  },
  corridorScroll: {
    marginHorizontal: -4,
  },
  corridorChip: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#272B35',
    marginRight: 8,
  },
  corridorChipRoute: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  corridorChipPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  inputGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '600',
    padding: 0,
  },
  priceInputText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  currencyBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stopChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#272B35',
    marginBottom: 8,
    gap: 8,
  },
  stopNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  stopNameText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  removeStopBtn: {
    padding: 4,
  },
  addStopRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  addStopInput: {
    flex: 1,
    backgroundColor: '#090D16',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#F8FAFC',
  },
  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.amber[400],
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addStopBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
  timePresetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  timePresetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timePresetChipActive: {
    backgroundColor: '#1E293B',
    borderColor: COLORS.amber[400],
  },
  timePresetText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  timePresetTextActive: {
    color: COLORS.amber[400],
    fontWeight: '800',
  },
  seatCountRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  seatCountBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#272B35',
    paddingVertical: 10,
    borderRadius: 10,
  },
  seatCountBtnActive: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
  },
  seatCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  seatCountTextActive: {
    color: '#0C0D11',
    fontWeight: '900',
  },
  toggleItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#090D16',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#272B35',
    marginTop: 8,
    marginBottom: 12,
  },
  toggleItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  toggleItemDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  revenueCard: {
    backgroundColor: '#090D16',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 14,
    gap: 8,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  revenueTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  revenueVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  revenueFee: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
    fontVariant: ['tabular-nums'],
  },
  revenueTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    marginTop: 4,
  },
  revenueTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  revenueTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.amber[400],
    fontVariant: ['tabular-nums'],
  },
  amenityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  amenityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  amenityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  notesInput: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 12,
    fontSize: 13,
    color: '#F8FAFC',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  publishBtn: {
    backgroundColor: COLORS.amber[400],
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    ...SHADOWS.md,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy[950],
  },
});
