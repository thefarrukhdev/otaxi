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
import { Badge } from '../../components/Badge';
import { useApp } from '../../context/AppContext';
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
  CheckCircle,
} from 'lucide-react-native';

interface CreateTripScreenProps {
  navigation: any;
}

export const CreateTripScreen: React.FC<CreateTripScreenProps> = ({ navigation }) => {
  const { createDriverTrip } = useApp();

  const [isInternational, setIsInternational] = useState(false);
  const [originCity, setOriginCity] = useState('Toshkent');
  const [originAddress, setOriginAddress] = useState('Olmazor metro bekati, avtoshoxbekat');
  const [destinationCity, setDestinationCity] = useState('Samarqand');
  const [destinationAddress, setDestinationAddress] = useState('Markaziy Registon shoxbekati');
  const [seatsCount, setSeatsCount] = useState(4);
  const [pricePerSeat, setPricePerSeat] = useState('90000');
  const [notes, setNotes] = useState('Konditsionerli yangi Malibu, qulay va tez safar.');

  // Amenities
  const [hasAC, setHasAC] = useState(true);
  const [hasLuggage, setHasLuggage] = useState(true);
  const [noSmoking, setNoSmoking] = useState(true);

  const handlePublish = () => {
    if (!originCity.trim() || !destinationCity.trim()) {
      Alert.alert('Xato', 'Iltimos, jo’nash va yetib borish shaharlarini kiriting.');
      return;
    }

    const price = parseInt(pricePerSeat.replace(/\D/g, ''), 10);
    if (isNaN(price) || price < 10000) {
      Alert.alert('Xato', 'O’rindiq narxi kamida 10,000 UZS bo’lishi kerak.');
      return;
    }

    createDriverTrip({
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      totalSeats: seatsCount,
      availableSeats: seatsCount,
      pricePerSeat: price,
      isInternational,
      notes,
    });

    Alert.alert(
      'Reys e’lon qilindi!',
      `${originCity} ➔ ${destinationCity} yo’nalishidagi reysingiz platformada muvaffaqiyatli chop etildi. Yo’lovchilar buyurtma berganda xabardor qilinasiz.`,
      [
        {
          text: 'Boshqaruvga o’tish',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Yangi reys e’lon qilish"
        subtitle="Shaharlararo yoki xalqaro qatnov yaratish"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Route Type Toggle */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safar turi</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.typeBtn, !isInternational && styles.typeBtnActive]}
              onPress={() => {
                setIsInternational(false);
                setDestinationCity('Samarqand');
                setPricePerSeat('90000');
              }}
            >
              <Text style={[styles.typeBtnText, !isInternational && styles.typeBtnTextActive]}>
                Shaharlararo reys
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, isInternational && styles.typeBtnActiveInternational]}
              onPress={() => {
                setIsInternational(true);
                setDestinationCity('Shymkent');
                setPricePerSeat('120000');
              }}
            >
              <Globe
                size={14}
                color={isInternational ? COLORS.white : COLORS.navy[300]}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  isInternational && styles.typeBtnTextActive,
                ]}
              >
                Xalqaro (Chegara)
              </Text>
            </TouchableOpacity>
          </View>

          {isInternational && (
            <View style={styles.internationalAlert}>
              <ShieldAlert size={16} color={COLORS.blue[400]} />
              <Text style={styles.internationalAlertText}>
                Xalqaro reyslarda yo’lovchilarga OTAXI chegara chek-listi (PAS-11) avtomatik ko’rsatiladi va hujjatlar talab qilinadi.
              </Text>
            </View>
          )}
        </View>

        {/* Route Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yo’nalish va manzillar</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Qayerdan (Shahar)</Text>
            <TextInput
              style={styles.formInput}
              value={originCity}
              onChangeText={setOriginCity}
              placeholder="Toshkent"
              placeholderTextColor={COLORS.navy[400]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Aniq jo’nash manzili / uchrashuv joyi</Text>
            <TextInput
              style={styles.formInput}
              value={originAddress}
              onChangeText={setOriginAddress}
              placeholder="Olmazor metro bekati, avtoshoxbekat"
              placeholderTextColor={COLORS.navy[400]}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Qayerga (Shahar)</Text>
            <TextInput
              style={styles.formInput}
              value={destinationCity}
              onChangeText={setDestinationCity}
              placeholder="Shymkent yoki Samarqand"
              placeholderTextColor={COLORS.navy[400]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Aniq yetib borish manzili</Text>
            <TextInput
              style={styles.formInput}
              value={destinationAddress}
              onChangeText={setDestinationAddress}
              placeholder="Markaziy avtovokzal / Registon"
              placeholderTextColor={COLORS.navy[400]}
            />
          </View>
        </View>

        {/* Departure Date & Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Jo’nash vaqti va narx</Text>

          <View style={styles.rowTwo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Sana</Text>
              <View style={styles.staticBox}>
                <Calendar size={16} color={COLORS.navy[300]} />
                <Text style={styles.staticBoxText}>Ertaga, 16-iyun</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Vaqt</Text>
              <View style={styles.staticBox}>
                <Clock size={16} color={COLORS.navy[300]} />
                <Text style={styles.staticBoxText}>07:00</Text>
              </View>
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Bo’sh joylar</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setSeatsCount((s) => Math.max(1, s - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterVal}>{seatsCount}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setSeatsCount((s) => Math.min(4, s + 1))}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Joy narxi (UZS)</Text>
              <TextInput
                style={styles.priceInput}
                value={pricePerSeat}
                onChangeText={setPricePerSeat}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Vehicle Amenities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Avtomobil qulayliklari</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Konditsioner mavjud</Text>
            <Switch
              value={hasAC}
              onValueChange={setHasAC}
              trackColor={{ false: COLORS.navy[700], true: COLORS.emerald[600] }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Katta yukxona (Bagaj)</Text>
            <Switch
              value={hasLuggage}
              onValueChange={setHasLuggage}
              trackColor={{ false: COLORS.navy[700], true: COLORS.emerald[600] }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Salonda chekish taqiqlangan</Text>
            <Switch
              value={noSmoking}
              onValueChange={setNoSmoking}
              trackColor={{ false: COLORS.navy[700], true: COLORS.emerald[600] }}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} activeOpacity={0.85}>
          <PlusCircle size={20} color={COLORS.white} />
          <Text style={styles.publishBtnText}>Reysni e’lon qilish</Text>
        </TouchableOpacity>
      </ScrollView>
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
  card: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy[800],
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.navy[700],
  },
  typeBtnActive: {
    backgroundColor: COLORS.emerald[600],
    borderColor: COLORS.emerald[500],
  },
  typeBtnActiveInternational: {
    backgroundColor: COLORS.blue[600],
    borderColor: COLORS.blue[500],
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy[300],
  },
  typeBtnTextActive: {
    color: COLORS.white,
  },
  internationalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c2340',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.blue[900],
  },
  internationalAlertText: {
    fontSize: 11,
    color: COLORS.blue[200],
    flex: 1,
    lineHeight: 16,
  },
  formGroup: {
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy[300],
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: COLORS.navy[950],
    borderWidth: 1,
    borderColor: COLORS.navy[700],
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.navy[800],
    marginVertical: 10,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  staticBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy[950],
    borderWidth: 1,
    borderColor: COLORS.navy[700],
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  staticBoxText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy[950],
    borderWidth: 1,
    borderColor: COLORS.navy[700],
    borderRadius: 10,
    height: 44,
    justifyContent: 'space-around',
  },
  counterBtn: {
    padding: 8,
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.amber[400],
  },
  counterVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
  },
  priceInput: {
    backgroundColor: COLORS.navy[950],
    borderWidth: 1,
    borderColor: COLORS.navy[700],
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.navy[800],
  },
  switchLabel: {
    fontSize: 13,
    color: COLORS.navy[200],
    fontWeight: '600',
  },
  publishBtn: {
    backgroundColor: COLORS.emerald[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
    ...SHADOWS.md,
  },
  publishBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
