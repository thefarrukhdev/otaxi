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
  ArrowRight,
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

        {/* Active Booking Banner */}
        {activeBooking && (
          <ActiveRideBanner
            booking={activeBooking}
            onPressDetails={() => navigation.navigate('Bookings')}
            onOpenChecklist={() => setChecklistVisible(true)}
          />
        )}

        {/* Taxi Orange & Dark Noir Search Card */}
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
                <Text style={styles.inputMiniLabel}>QAYERDAN</Text>
                <TextInput
                  style={styles.inputField}
                  value={fromCity}
                  onChangeText={setFromCity}
                  placeholder="Shahar nomi"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.divider} />

              {/* To */}
              <View style={styles.inputItem}>
                <Text style={styles.inputMiniLabel}>QAYERGA</Text>
                <TextInput
                  style={styles.inputField}
                  value={toCity}
                  onChangeText={setToCity}
                  placeholder="Samarqand, Shymkent..."
                  placeholderTextColor="#64748B"
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
                <ArrowUpDown size={14} color="#FF8800" />
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
                <Users size={12} color="#94A3B8" />
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

          {/* Taxi Orange Primary CTA Button (matches user's screenshot) */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.88}
          >
            <Search size={18} color="#0C0D11" strokeWidth={2.8} />
            <Text style={styles.searchButtonText}>
              {matchingTrips.length > 0
                ? `Reyslarni ko'rish (${matchingTrips.length})`
                : 'Reyslarni qidirish'}
            </Text>
            <View style={styles.ctaArrowCircle}>
              <ArrowRight size={14} color="#FFFFFF" strokeWidth={3} />
            </View>
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
                  activeOpacity={0.78}
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
                        <Clock size={11} color="#94A3B8" />
                        <Text style={styles.timeTagText}>{depTime}</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.carText}>{trip.vehicle.model}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.ratingRow}>
                        <Star size={11} color="#FF8800" fill="#FF8800" />
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
    backgroundColor: '#0C0D11',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  heroSection: {
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  searchCard: {
    backgroundColor: '#15171E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D26',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#242834',
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
    backgroundColor: '#FF8800',
  },
  routeLine: {
    width: 1.5,
    height: 28,
    backgroundColor: '#2E3340',
    marginVertical: 3,
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FF8800',
    backgroundColor: 'transparent',
  },
  inputsCol: {
    flex: 1,
  },
  inputItem: {
    paddingVertical: 2,
  },
  inputMiniLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  inputField: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    padding: 0,
    height: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#242834',
    marginVertical: 4,
  },
  swapBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222530',
    borderWidth: 1,
    borderColor: '#303444',
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
    backgroundColor: '#1A1D26',
    borderRadius: 10,
    padding: 3,
    gap: 3,
    borderWidth: 1,
    borderColor: '#242834',
  },
  datePill: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  datePillActive: {
    backgroundColor: '#272B36',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dateTextActive: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passengersBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D26',
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#242834',
  },
  passengersValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  passengersNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  counterBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#242834',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.3,
  },
  counterBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FF8800', // Iconic Radiant Taxi Orange
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  searchButtonText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0C0D11',
    letterSpacing: 0.2,
  },
  ctaArrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0C0D11',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
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
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF8800',
  },
  tripsList: {
    gap: 8,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#15171E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 12,
  },
  tripCardLeft: {
    flex: 1,
  },
  tripRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  tripCityText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
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
    color: '#94A3B8',
  },
  metaDot: {
    fontSize: 8,
    color: '#475569',
  },
  carText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tripCardRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  priceNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FF8800',
  },
  priceCurrency: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  seatsLeftText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#71717A',
    marginTop: 2,
  },
});
