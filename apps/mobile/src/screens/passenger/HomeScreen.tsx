import React, { useState } from 'react';
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
import { BoardingPassCard } from '../../components/BoardingPassCard';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import {
  CorridorQuickSelect,
  RouteOption,
} from '../../components/passenger';
import { Haptics } from '../../components/ui/Haptics';
import { useApp } from '../../context/AppContext';
import { getBorderChecklist } from '../../lib/data';
import { CountryCode } from '@otaxi/types';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  Compass,
  FileCheck2,
  ArrowUpDown,
  Lock,
  Headphones,
} from 'lucide-react-native';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { activeBooking, cancelBooking, trips } = useApp();
  const [fromCity, setFromCity] = useState('Toshkent');
  const [toCity, setToCity] = useState('');
  const [selectedDate, setSelectedDate] = useState<'TODAY' | 'TOMORROW'>('TODAY');
  const [passengersCount, setPassengersCount] = useState(1);
  const [isChecklistVisible, setChecklistVisible] = useState(false);

  // Calculate available trips count
  const matchingTripsCount = trips.filter((t) => {
    if (fromCity && !t.originCity.toLowerCase().includes(fromCity.toLowerCase())) {
      return false;
    }
    if (toCity && !t.destinationCity.toLowerCase().includes(toCity.toLowerCase())) {
      return false;
    }
    return t.availableSeats >= passengersCount;
  }).length;

  const handleSearch = () => {
    Haptics.selection();
    navigation.navigate('TripsList', {
      from: fromCity,
      to: toCity,
      passengers: passengersCount,
      date: selectedDate,
    });
  };

  const handleSwapCities = () => {
    Haptics.light();
    if (!toCity) return;
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSelectCorridor = (route: RouteOption) => {
    Haptics.selection();
    setFromCity(route.from);
    setToCity(route.to);
    navigation.navigate('TripsList', {
      from: route.from,
      to: route.to,
      passengers: passengersCount,
      isInternational: route.isInternational,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Shaharlararo va xalqaro safarlar"
        subtitle="Markaziy Osiyo bo'ylab tekshirilgan haydovchilar bilan xavfsiz qatnov"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Booking Reminder if passenger has one */}
        {activeBooking && (
          <View style={styles.activeBookingSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.activePill}>
                <View style={styles.activePulseDot} />
                <Text style={styles.activePillText}>Sizning faol safaringiz</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Bookings')}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>Barchasini ko'rish</Text>
                <ArrowRight size={13} color={COLORS.emerald[700]} />
              </TouchableOpacity>
            </View>
            <BoardingPassCard
              booking={activeBooking}
              onOpenChecklist={() => setChecklistVisible(true)}
              onCancelBooking={(id) => cancelBooking(id)}
            />
          </View>
        )}

        {/* Search Hero Card */}
        <View style={styles.searchCard}>
          <View style={styles.searchCardHeader}>
            <View style={styles.searchTypePill}>
              <Sparkles size={14} color={COLORS.emerald[700]} />
              <Text style={styles.searchTypePillText}>Shaharlararo & Xalqaro qatnov</Text>
            </View>
            <Text style={styles.availableCounterText}>
              {matchingTripsCount > 0
                ? `${matchingTripsCount} ta reys topildi`
                : "Barcha yo'nalishlar"}
            </Text>
          </View>

          {/* From Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconCircle}>
              <MapPin size={16} color={COLORS.emerald[600]} />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Qayerdan</Text>
              <TextInput
                style={styles.textInput}
                value={fromCity}
                onChangeText={setFromCity}
                placeholder="Shahar nomi (Masalan: Toshkent)"
                placeholderTextColor={COLORS.gray[400]}
              />
            </View>
            {toCity ? (
              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapCities}
                activeOpacity={0.7}
                accessibilityLabel="Shaharlarni almashtirish"
              >
                <ArrowUpDown size={16} color={COLORS.gray[600]} />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.inputDivider} />

          {/* To Input */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputIconCircle, { backgroundColor: COLORS.blue[50] }]}>
              <Compass size={16} color={COLORS.blue[600]} />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Qayerga</Text>
              <TextInput
                style={styles.textInput}
                value={toCity}
                onChangeText={setToCity}
                placeholder="Shahar nomi (Shymkent 🇰🇿, Samarqand...)"
                placeholderTextColor={COLORS.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputDivider} />

          {/* Date Selector Row */}
          <View style={styles.optionsRow}>
            <View style={styles.optionBox}>
              <Calendar size={16} color={COLORS.gray[500]} />
              <View style={styles.dateSelectorCol}>
                <Text style={styles.optionLabel}>Jo'nash sanasi</Text>
                <View style={styles.dateButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.dateChip,
                      selectedDate === 'TODAY' && styles.dateChipActive,
                    ]}
                    onPress={() => {
                      Haptics.light();
                      setSelectedDate('TODAY');
                    }}
                  >
                    <Text
                      style={[
                        styles.dateChipText,
                        selectedDate === 'TODAY' && styles.dateChipTextActive,
                      ]}
                    >
                      Bugun
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dateChip,
                      selectedDate === 'TOMORROW' && styles.dateChipActive,
                    ]}
                    onPress={() => {
                      Haptics.light();
                      setSelectedDate('TOMORROW');
                    }}
                  >
                    <Text
                      style={[
                        styles.dateChipText,
                        selectedDate === 'TOMORROW' && styles.dateChipTextActive,
                      ]}
                    >
                      Ertaga
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Passengers Count Counter */}
            <View style={styles.optionBox}>
              <Users size={16} color={COLORS.gray[500]} />
              <View>
                <Text style={styles.optionLabel}>Yo'lovchilar</Text>
                <View style={styles.passengersCounter}>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.light();
                      setPassengersCount((p) => Math.max(1, p - 1));
                    }}
                    style={styles.counterBtn}
                    disabled={passengersCount <= 1}
                  >
                    <Text
                      style={[
                        styles.counterBtnText,
                        passengersCount <= 1 && styles.counterBtnTextDisabled,
                      ]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{passengersCount}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.light();
                      setPassengersCount((p) => Math.min(4, p + 1));
                    }}
                    style={styles.counterBtn}
                    disabled={passengersCount >= 4}
                  >
                    <Text
                      style={[
                        styles.counterBtnText,
                        passengersCount >= 4 && styles.counterBtnTextDisabled,
                      ]}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.88}
          >
            <Search size={18} color={COLORS.white} />
            <Text style={styles.searchButtonText}>
              {matchingTripsCount > 0
                ? `Reyslarni qidirish (${matchingTripsCount} ta bo'sh reys)`
                : 'Reyslarni qidirish'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tezkor Koridorlar Karuseli */}
        <CorridorQuickSelect
          onSelectRoute={handleSelectCorridor}
          selectedTo={toCity}
          selectedFrom={fromCity}
        />

        {/* International Border Guide Quick Banner */}
        <TouchableOpacity
          style={styles.borderBanner}
          onPress={() => {
            Haptics.selection();
            setChecklistVisible(true);
          }}
          activeOpacity={0.88}
        >
          <View style={styles.borderBannerIconCircle}>
            <Globe size={22} color={COLORS.blue[600]} />
          </View>
          <View style={styles.borderBannerContent}>
            <View style={styles.borderBannerTitleRow}>
              <Text style={styles.borderBannerTitle}>Xalqaro chegara yordamchisi</Text>
              <Badge label="Gid 🇰🇿 🇰🇬 🇹🇯" variant="blue" />
            </View>
            <Text style={styles.borderBannerSubtitle}>
              Qozog'iston, Qirg'iziston va Tojikiston chegaralariga tayyorgarlik chek-listi
            </Text>
          </View>
          <ArrowRight size={18} color={COLORS.blue[600]} />
        </TouchableOpacity>

        {/* Platform Advantages / Mobility Guarantees */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>OTAXI Safar Kafolatlari</Text>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.emerald[50] }]}>
              <ShieldCheck size={22} color={COLORS.emerald[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>100% Tekshirilgan haydovchilar</Text>
              <Text style={styles.featureText}>
                Har bir haydovchining shaxsi, haydovchilik guvohnomasi, avtomobil texpasporti va sug'urtasi qat'iy tekshiriladi.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.blue[50] }]}>
              <FileCheck2 size={22} color={COLORS.blue[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Chegara qoidalari chek-listi</Text>
              <Text style={styles.featureText}>
                Xorijiy pasport muddati, 30 kunlik vizasiz rejim, bolalar ruxsatnomasi va valyuta me'yorlari to'lovdan oldin ko'rsatiladi.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.amber[50] }]}>
              <Sparkles size={22} color={COLORS.amber[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Interaktiv joy tanlash & Kafolat</Text>
              <Text style={styles.featureText}>
                Old o'rindiq (VIP) yoki orqa qulay joyni tanlaysiz. 4 xonali bort kodi orqali soxta bronlarning oldi olinadi.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.navy[100] }]}>
              <Headphones size={22} color={COLORS.navy[700]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>24/7 Safar xavfsizligi va qo'llab-quvvatlash</Text>
              <Text style={styles.featureText}>
                Tog'li dovonlar va cho'l magistral yo'llarida GPS monitoring va dispetcherlik nazorati.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Border Checklist Modal */}
      <BorderChecklistModal
        visible={isChecklistVisible}
        onClose={() => setChecklistVisible(false)}
        checklist={getBorderChecklist(CountryCode.UZ, CountryCode.KZ)}
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
    paddingBottom: 36,
  },
  activeBookingSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  activePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald[600],
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[700],
  },
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    padding: 18,
    ...SHADOWS.md,
  },
  searchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  searchTypePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.emerald[800],
  },
  availableCounterText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray[500],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  inputFieldContainer: {
    flex: 1,
  },
  inputIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
    padding: 0,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  inputDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginVertical: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  optionBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateSelectorCol: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[400],
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dateChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  dateChipActive: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[500],
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  dateChipTextActive: {
    color: COLORS.emerald[800],
    fontWeight: '800',
  },
  passengersCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  counterBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  counterBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  counterBtnTextDisabled: {
    color: COLORS.gray[300],
  },
  counterValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gray[900],
    paddingHorizontal: 10,
    fontVariant: ['tabular-nums'],
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.emerald[600],
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    ...SHADOWS.sm,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  borderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 14,
    gap: 12,
    marginVertical: 10,
    ...SHADOWS.sm,
  },
  borderBannerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  borderBannerContent: {
    flex: 1,
  },
  borderBannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  borderBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  borderBannerSubtitle: {
    fontSize: 11,
    color: '#3B82F6',
    lineHeight: 15,
  },
  featuresSection: {
    marginTop: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    padding: 14,
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.sm,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.gray[500],
    lineHeight: 16,
  },
});
