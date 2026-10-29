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

        {/* Minimalist Taxi Orange Search Card */}
        <View style={styles.searchCard}>
          {/* Route Inputs */}
          <View style={styles.routeInputs}>
            <View style={styles.inputRow}>
              <View style={styles.dotOrigin} />
              <TextInput
                style={styles.inputField}
                value={fromCity}
                onChangeText={setFromCity}
                placeholder="Qayerdan..."
                placeholderTextColor="#64748B"
              />
              {toCity ? (
                <TouchableOpacity
                  style={styles.swapBtn}
                  onPress={handleSwapCities}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <ArrowUpDown size={13} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.inputDivider} />

            <View style={styles.inputRow}>
              <View style={styles.dotDest} />
              <TextInput
                style={styles.inputField}
                value={toCity}
                onChangeText={setToCity}
                placeholder="Qayerga borasiz? (Samarqand, Shymkent...)"
                placeholderTextColor="#64748B"
              />
            </View>
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>

              <View style={styles.passengersValueRow}>
                <Users size={14} color="#94A3B8" />
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Clean Solid CTA Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.88}
          >
            <Search size={17} color="#0C0D11" strokeWidth={2.6} />
            <Text style={styles.searchButtonText}>
              {matchingTrips.length > 0
                ? `Reyslarni ko'rish (${matchingTrips.length})`
                : 'Reyslarni qidirish'}
            </Text>
            <ArrowRight size={16} color="#0C0D11" strokeWidth={2.6} />
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
                      <Text style={[styles.timeTagText, trip.departureType === 'WHEN_FULL' && styles.timeTagWhenFull]}>
                        {trip.departureType === 'WHEN_FULL' ? '⚡ To’lsa ketamiz' : depTime}
                      </Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.carText}>{trip.vehicle.model}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.ratingText}>★ {trip.driver.rating}</Text>
                    </View>
                  </View>

                  <View style={styles.tripCardRight}>
                    <Text style={styles.priceNumber}>
                      {trip.pricePerSeat.toLocaleString('uz-UZ')}{' '}
                      <Text style={styles.priceCurrency}>UZS</Text>
                    </Text>
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
    borderColor: '#242834',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
  },
  routeInputs: {
    backgroundColor: '#191C25',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222632',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    gap: 10,
  },
  dotOrigin: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF8800',
  },
  dotDest: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: '#FF8800',
    backgroundColor: 'transparent',
  },
  inputField: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    padding: 0,
  },
  inputDivider: {
    height: 1,
    backgroundColor: '#222632',
    marginLeft: 17,
  },
  swapBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#222530',
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
    backgroundColor: '#191C25',
    borderRadius: 10,
    padding: 3,
    gap: 3,
    borderWidth: 1,
    borderColor: '#222632',
  },
  datePill: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  datePillActive: {
    backgroundColor: '#272B36',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A92A6',
  },
  dateTextActive: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passengersBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C25',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 5,
    gap: 6,
    borderWidth: 1,
    borderColor: '#222632',
  },
  passengersValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 2,
  },
  passengersNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222530',
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
    backgroundColor: '#FF8800',
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
  timeTagWhenFull: {
    color: '#FF8800',
    fontWeight: '800',
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
