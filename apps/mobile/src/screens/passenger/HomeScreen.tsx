import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Header } from '../../components/Header';
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
  ArrowUpDown,
  Clock,
  Star,
  Users,
  ChevronRight,
} from 'lucide-react-native';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { activeBooking, trips } = useApp();
  const [fromCity, setFromCity] = useState('Toshkent');
  const [toCity, setToCity] = useState('');
  const [selectedDate, setSelectedDate] = useState<'TODAY' | 'TOMORROW'>('TODAY');
  const [passengersCount, setPassengersCount] = useState(1);
  const [isChecklistVisible, setChecklistVisible] = useState(false);

  // Filter matching trips
  const matchingTrips = trips.filter((t) => {
    if (fromCity && !t.originCity.toLowerCase().includes(fromCity.toLowerCase())) {
      return false;
    }
    if (toCity && !t.destinationCity.toLowerCase().includes(toCity.toLowerCase())) {
      return false;
    }
    return t.availableSeats >= passengersCount;
  });

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
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Qayerga borasiz?</Text>
        </View>

        {/* Active Booking Minimal Banner */}
        {activeBooking && (
          <ActiveRideBanner
            booking={activeBooking}
            onPressDetails={() => navigation.navigate('Bookings')}
            onOpenChecklist={() => setChecklistVisible(true)}
          />
        )}

        {/* Minimal Search Card */}
        <View style={styles.searchCard}>
          {/* Route Section */}
          <View style={styles.routeBox}>
            <View style={styles.pinCol}>
              <View style={styles.originDot} />
              <View style={styles.routeLine} />
              <View style={styles.destDot} />
            </View>

            <View style={styles.inputsCol}>
              {/* From */}
              <View style={styles.inputItem}>
                <Text style={styles.inputMiniLabel}>Qayerdan</Text>
                <TextInput
                  style={styles.inputField}
                  value={fromCity}
                  onChangeText={setFromCity}
                  placeholder="Shahar nomi"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.divider} />

              {/* To */}
              <View style={styles.inputItem}>
                <Text style={styles.inputMiniLabel}>Qayerga</Text>
                <TextInput
                  style={styles.inputField}
                  value={toCity}
                  onChangeText={setToCity}
                  placeholder="Samarqand, Shymkent..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Swap Button */}
            {toCity ? (
              <TouchableOpacity
                style={styles.swapBtn}
                onPress={handleSwapCities}
                activeOpacity={0.7}
              >
                <ArrowUpDown size={14} color="#475569" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Options Row: Date & Passengers */}
          <View style={styles.optionsRow}>
            {/* Date */}
            <View style={styles.dateSelector}>
              <TouchableOpacity
                style={[
                  styles.datePill,
                  selectedDate === 'TODAY' && styles.datePillActive,
                ]}
                onPress={() => {
                  Haptics.light();
                  setSelectedDate('TODAY');
                }}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === 'TODAY' && styles.dateTextActive,
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
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === 'TOMORROW' && styles.dateTextActive,
                  ]}
                >
                  Ertaga
                </Text>
              </TouchableOpacity>
            </View>

            {/* Passengers */}
            <View style={styles.passengersBox}>
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
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>

              <View style={styles.passengersValueRow}>
                <Users size={12} color="#64748B" />
                <Text style={styles.passengersNum}>{passengersCount}</Text>
              </View>

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
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search CTA */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.85}
          >
            <Search size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.searchButtonText}>
              {matchingTrips.length > 0
                ? `Reyslarni ko'rish (${matchingTrips.length})`
                : 'Reyslarni qidirish'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Popular Corridors */}
        <CorridorQuickSelect
          onSelectRoute={handleSelectCorridor}
          selectedTo={toCity}
          selectedFrom={fromCity}
        />

        {/* Available Live Rides Preview */}
        <View style={styles.tripsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mavjud reyslar</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Trips')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>Barchasi →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tripsList}>
            {trips.slice(0, 3).map((trip) => {
              const depTime = new Date(trip.departureTime).toLocaleTimeString('uz-UZ', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <TouchableOpacity
                  key={trip.id}
                  style={styles.tripCard}
                  onPress={() => {
                    Haptics.light();
                    navigation.navigate('TripDetails', { tripId: trip.id });
                  }}
                  activeOpacity={0.75}
                >
                  <View style={styles.tripCardLeft}>
                    <View style={styles.tripRouteRow}>
                      <Text style={styles.tripCityText}>
                        {trip.originCity} → {trip.destinationCity}
                      </Text>
                      {trip.isInternational && <Text style={styles.intlFlag}>🇰🇿</Text>}
                    </View>

                    <View style={styles.tripMetaRow}>
                      <View style={styles.timeTag}>
                        <Clock size={11} color="#64748B" />
                        <Text style={styles.timeTagText}>{depTime}</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.carText}>{trip.vehicle.model}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.ratingRow}>
                        <Star size={11} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingText}>{trip.driver.rating}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.tripCardRight}>
                    <Text style={styles.priceNumber}>
                      {trip.pricePerSeat.toLocaleString('uz-UZ')}
                    </Text>
                    <Text style={styles.priceCurrency}>UZS</Text>
                    <Text style={styles.seatsLeftText}>{trip.availableSeats} ta joy</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  heroSection: {
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
    marginBottom: 12,
  },
  pinCol: {
    alignItems: 'center',
    width: 14,
    marginRight: 10,
    paddingVertical: 10,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#090D16',
  },
  routeLine: {
    width: 1.5,
    height: 28,
    backgroundColor: '#CBD5E1',
    marginVertical: 3,
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  inputsCol: {
    flex: 1,
  },
  inputItem: {
    paddingVertical: 2,
  },
  inputMiniLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  inputField: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    padding: 0,
    height: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  swapBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateSelector: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  datePill: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  datePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  dateTextActive: {
    fontWeight: '700',
    color: '#0F172A',
  },
  passengersBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 6,
    gap: 6,
  },
  passengersValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  passengersNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  counterBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  counterBtnDisabled: {
    opacity: 0.35,
  },
  counterBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F172A', // Ultra-sleek minimalist dark slate CTA
  },
  searchButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tripsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#090D16',
  },
  tripsList: {
    gap: 8,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  tripCardLeft: {
    flex: 1,
  },
  tripRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tripCityText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  intlFlag: {
    fontSize: 12,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  metaDot: {
    fontSize: 8,
    color: '#CBD5E1',
  },
  carText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  tripCardRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  priceNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#090D16',
  },
  priceCurrency: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  seatsLeftText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
});
