import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { useApp } from '../../context/AppContext';
import { DetailedTrip } from '../../types';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Car,
  ChevronRight,
  Luggage,
  Wind,
  CheckCircle,
} from 'lucide-react-native';

interface TripsListScreenProps {
  navigation: any;
  route: any;
}

export const TripsListScreen: React.FC<TripsListScreenProps> = ({ navigation, route }) => {
  const { trips } = useApp();
  const initialFrom = route.params?.from || '';
  const initialTo = route.params?.to || '';

  const [activeTab, setActiveTab] = useState<'ALL' | 'INTERNATIONAL' | 'INTERCITY'>('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialTo || '');

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'INTERNATIONAL' && !trip.isInternational) return false;
    if (activeTab === 'INTERCITY' && trip.isInternational) return false;
    if (onlyVerified && !trip.driver.isVerified) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDest = trip.destinationCity.toLowerCase().includes(q);
      const matchOrigin = trip.originCity.toLowerCase().includes(q);
      if (!matchDest && !matchOrigin) return false;
    }

    return true;
  });

  const renderTripItem = ({ item }: { item: DetailedTrip }) => {
    const departureDate = new Date(item.departureTime);
    const arrivalDate = new Date(item.estimatedArrivalTime);

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
        activeOpacity={0.85}
      >
        {/* Top Badges */}
        <View style={styles.cardTopRow}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {item.isInternational ? (
              <Badge label="Xalqaro reys" variant="blue" />
            ) : (
              <Badge label="Shaharlararo" variant="emerald" />
            )}
            {item.driver.isVerified && (
              <Badge
                label="Tekshirilgan"
                variant="emerald"
                icon={<ShieldCheck size={11} color={COLORS.emerald[700]} />}
              />
            )}
          </View>
          <Text style={styles.seatsBadgeText}>{item.availableSeats} ta bo'sh joy</Text>
        </View>

        {/* Timeline Row */}
        <View style={styles.timelineRow}>
          <View style={styles.timeCol}>
            <Text style={styles.timeBig}>
              {departureDate.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.cityText}>{item.originCity}</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.originAddress}
            </Text>
          </View>

          <View style={styles.timelineMiddle}>
            <Text style={styles.durationText}>
              {Math.floor(item.durationMinutes / 60)}s {item.durationMinutes % 60}d
            </Text>
            <View style={styles.timelineLine}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLineBar} />
              <View style={[styles.timelineDot, styles.timelineDotEnd]} />
            </View>
            {item.stops.length > 0 && (
              <Text style={styles.stopsCount}>{item.stops.length} ta oraliq to’xtash</Text>
            )}
          </View>

          <View style={[styles.timeCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.timeBig}>
              {arrivalDate.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.cityText}>{item.destinationCity}</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.destinationAddress}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Driver & Price Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.driverCol}>
            <View style={styles.driverAvatar}>
              <Text style={styles.avatarText}>{item.driver.fullName.slice(0, 2)}</Text>
            </View>
            <View>
              <Text style={styles.driverName}>{item.driver.fullName}</Text>
              <View style={styles.ratingRow}>
                <Star size={12} color="#eab308" fill="#eab308" />
                <Text style={styles.ratingText}>{item.driver.rating.toFixed(2)}</Text>
                <Text style={styles.tripsCountText}>• {item.driver.totalTrips} safar</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceCol}>
            <Text style={styles.priceAmount}>
              {item.pricePerSeat.toLocaleString('uz-UZ')} UZS
            </Text>
            <Text style={styles.perSeatLabel}>1 o'rindiq uchun</Text>
          </View>
        </View>

        {/* Amenities Bar */}
        <View style={styles.amenitiesBar}>
          <Text style={styles.vehicleName}>
            {item.vehicle.make} {item.vehicle.model} ({item.vehicle.year})
          </Text>
          <View style={styles.amenitiesIcons}>
            {item.vehicle.hasAirConditioner && (
              <View style={styles.amenityChip}>
                <Wind size={12} color={COLORS.emerald[700]} />
                <Text style={styles.amenityChipText}>Konditsioner</Text>
              </View>
            )}
            {item.allowLuggage && (
              <View style={styles.amenityChip}>
                <Luggage size={12} color={COLORS.emerald[700]} />
                <Text style={styles.amenityChipText}>Yukxona</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Mavjud reyslar" subtitle={`${filteredTrips.length} ta safar topildi`} />

      {/* Filter Tabs */}
      <View style={styles.filterTabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsRow}>
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'ALL' && styles.tabChipActive]}
            onPress={() => setActiveTab('ALL')}
          >
            <Text style={[styles.tabChipText, activeTab === 'ALL' && styles.tabChipTextActive]}>
              Barcha reyslar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'INTERNATIONAL' && styles.tabChipActive]}
            onPress={() => setActiveTab('INTERNATIONAL')}
          >
            <Text
              style={[
                styles.tabChipText,
                activeTab === 'INTERNATIONAL' && styles.tabChipTextActive,
              ]}
            >
              Xalqaro (Chegara orqali)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'INTERCITY' && styles.tabChipActive]}
            onPress={() => setActiveTab('INTERCITY')}
          >
            <Text
              style={[styles.tabChipText, activeTab === 'INTERCITY' && styles.tabChipTextActive]}
            >
              Shaharlararo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, onlyVerified && styles.tabChipActive]}
            onPress={() => setOnlyVerified(!onlyVerified)}
          >
            <Text style={[styles.tabChipText, onlyVerified && styles.tabChipTextActive]}>
              Faqat tekshirilgan ★
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Trips FlatList */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Reyslar topilmadi</Text>
            <Text style={styles.emptySubtitle}>
              Tanlangan shartlar bo’yicha reyslar mavjud emas. Filtrlarni o’zgartirib ko’ring.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  filterTabsWrapper: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterTabsRow: {
    paddingHorizontal: 16,
  },
  tabChip: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  tabChipActive: {
    backgroundColor: COLORS.emerald[600],
    borderColor: COLORS.emerald[700],
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[700],
  },
  tabChipTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tripCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    ...SHADOWS.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seatsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emerald[700],
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeCol: {
    flex: 1,
  },
  timeBig: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.gray[900],
  },
  cityText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[800],
    marginTop: 2,
  },
  addressText: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  timelineMiddle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  timelineLine: {
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
    backgroundColor: COLORS.blue[600],
  },
  timelineLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.gray[300],
  },
  stopsCount: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.blue[600],
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gray[700],
  },
  tripsCountText: {
    fontSize: 10,
    color: COLORS.gray[400],
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.emerald[700],
  },
  perSeatLabel: {
    fontSize: 10,
    color: COLORS.gray[400],
    marginTop: 1,
  },
  amenitiesBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
  },
  vehicleName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[600],
  },
  amenitiesIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  amenityChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 6,
  },
});
