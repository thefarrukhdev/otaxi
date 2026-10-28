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
import { COLORS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { ActiveRideBanner } from '../../components/passenger/ActiveRideBanner';
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
  ArrowRight,
  ArrowUpDown,
  FileCheck2,
  Sparkles,
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

  // Calculate matching trips count
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
        title="Qayerga borasiz?"
        subtitle="Markaziy Osiyo bo'ylab shaharlararo & xalqaro qatnov"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Booking Compact Banner */}
        {activeBooking && (
          <ActiveRideBanner
            booking={activeBooking}
            onPressDetails={() => navigation.navigate('Bookings')}
            onOpenChecklist={() => setChecklistVisible(true)}
          />
        )}

        {/* Mobility Search Hero Card */}
        <View style={styles.searchCard}>
          <View style={styles.searchCardTopBadge}>
            <Sparkles size={13} color={COLORS.emerald[700]} />
            <Text style={styles.searchCardBadgeText}>SHAHARLARARO & XALQARO</Text>
            <Text style={styles.matchingTripsBadge}>
              {matchingTripsCount > 0 ? `${matchingTripsCount} ta reys` : 'Barcha reyslar'}
            </Text>
          </View>

          {/* Connected Route Input Box */}
          <View style={styles.routeContainer}>
            {/* Visual Route Connector Pins */}
            <View style={styles.connectorColumn}>
              <View style={styles.originDot} />
              <View style={styles.connectorDashedLine} />
              <View style={styles.destinationPin} />
            </View>

            {/* Inputs Column */}
            <View style={styles.inputsColumn}>
              {/* Origin Input */}
              <View style={styles.inputRow}>
                <Text style={styles.inputTinyLabel}>QAYERDAN</Text>
                <TextInput
                  style={styles.cityTextInput}
                  value={fromCity}
                  onChangeText={setFromCity}
                  placeholder="Shahar nomi (Masalan: Toshkent)"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.horizontalDivider} />

              {/* Destination Input */}
              <View style={styles.inputRow}>
                <Text style={styles.inputTinyLabel}>QAYERGA</Text>
                <TextInput
                  style={styles.cityTextInput}
                  value={toCity}
                  onChangeText={setToCity}
                  placeholder="Samarqand, Shymkent 🇰🇿..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Swap Button */}
            {toCity ? (
              <TouchableOpacity
                style={styles.floatingSwapButton}
                onPress={handleSwapCities}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <ArrowUpDown size={15} color="#475569" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Date & Passengers Row */}
          <View style={styles.optionsRow}>
            {/* Date Pill Selector */}
            <View style={styles.optionBlock}>
              <Text style={styles.optionLabel}>SANA</Text>
              <View style={styles.datePillsRow}>
                <TouchableOpacity
                  style={[
                    styles.datePill,
                    selectedDate === 'TODAY' && styles.datePillActive,
                  ]}
                  onPress={() => {
                    Haptics.light();
                    setSelectedDate('TODAY');
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.datePillText,
                      selectedDate === 'TODAY' && styles.datePillTextActive,
                    ]}
                  >
                    Bugun
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.datePill,
                    selectedDate === 'TOMORROW' && styles.datePillActive,
                  ]}
                  onPress={() => {
                    Haptics.light();
                    setSelectedDate('TOMORROW');
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.datePillText,
                      selectedDate === 'TOMORROW' && styles.datePillTextActive,
                    ]}
                  >
                    Ertaga
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Passenger Counter */}
            <View style={styles.optionBlock}>
              <Text style={styles.optionLabel}>YO'LOVCHILAR</Text>
              <View style={styles.passengerCounterRow}>
                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    passengersCount <= 1 && styles.counterBtnDisabled,
                  ]}
                  onPress={() => {
                    Haptics.light();
                    setPassengersCount((p) => Math.max(1, p - 1));
                  }}
                  disabled={passengersCount <= 1}
                  activeOpacity={0.7}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.counterNumber}>{passengersCount}</Text>

                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    passengersCount >= 4 && styles.counterBtnDisabled,
                  ]}
                  onPress={() => {
                    Haptics.light();
                    setPassengersCount((p) => Math.min(4, p + 1));
                  }}
                  disabled={passengersCount >= 4}
                  activeOpacity={0.7}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchCtaButton}
            onPress={handleSearch}
            activeOpacity={0.88}
          >
            <Search size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.searchCtaText}>
              {matchingTripsCount > 0
                ? `Reyslarni qidirish (${matchingTripsCount} ta bo'sh reys)`
                : 'Reyslarni qidirish'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Popular Corridors Horizontal Carousel */}
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
            <Globe size={20} color="#2563EB" />
          </View>
          <View style={styles.borderBannerContent}>
            <View style={styles.borderBannerTitleRow}>
              <Text style={styles.borderBannerTitle}>Xalqaro chegara tayyorgarligi</Text>
              <View style={styles.miniBadge}>
                <Text style={styles.miniBadgeText}>Gid 🇰🇿 🇰🇬 🇹🇯</Text>
              </View>
            </View>
            <Text style={styles.borderBannerSubtitle}>
              Qozog'iston, Qirg'iziston va Tojikiston bo'yicha viza va bojxona qoidalari
            </Text>
          </View>
          <ArrowRight size={16} color="#2563EB" />
        </TouchableOpacity>

        {/* Mobility Guarantees Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>OTAXI Safar Kafolatlari</Text>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#F0FDF4' }]}>
              <ShieldCheck size={20} color={COLORS.emerald[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>100% Tekshirilgan haydovchilar</Text>
              <Text style={styles.featureText}>
                Haydovchilik guvohnomasi, avtomobil texpasporti va sug'urtasi qat'iy tekshirilgan.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#EFF6FF' }]}>
              <FileCheck2 size={20} color="#2563EB" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Chegara qoidalari chek-listi</Text>
              <Text style={styles.featureText}>
                Xorijiy pasport muddati, 30 kunlik vizasiz rejim va bojxona deklaratsiyasi nazorati.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
              <Sparkles size={20} color="#D97706" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Aniq o'rindiq & 4 xonali bort kodi</Text>
              <Text style={styles.featureText}>
                Old VIP yoki orqa o'rindiqni aniq tanlaysiz. 4 xonali kod bilan mashinaga chiqasiz.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#F1F5F9' }]}>
              <Headphones size={20} color="#334155" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>24/7 Dispetcherlik va xavfsizlik</Text>
              <Text style={styles.featureText}>
                Tog'li dovonlar va cho'l magistrallarida doimiy GPS monitoring va qo'llab-quvvatlash.
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
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 16,
  },
  searchCardTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  searchCardBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.emerald[800],
    letterSpacing: 0.5,
  },
  matchingTripsBadge: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
    marginBottom: 14,
  },
  connectorColumn: {
    alignItems: 'center',
    width: 20,
    marginRight: 8,
    paddingVertical: 12,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.emerald[600],
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  connectorDashedLine: {
    width: 2,
    height: 32,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  destinationPin: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
    transform: [{ rotate: '45deg' }],
  },
  inputsColumn: {
    flex: 1,
  },
  inputRow: {
    paddingVertical: 4,
  },
  inputTinyLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cityTextInput: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    padding: 0,
    height: 24,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 6,
  },
  floatingSwapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  optionBlock: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  datePillsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  datePill: {
    flex: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  datePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  datePillTextActive: {
    color: '#0F172A',
  },
  passengerCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 6,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  counterBtnDisabled: {
    opacity: 0.4,
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  counterNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  searchCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.emerald[600],
    shadowColor: COLORS.emerald[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  searchCtaText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  borderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 14,
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  borderBannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  miniBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  miniBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  borderBannerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  featuresSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
});
