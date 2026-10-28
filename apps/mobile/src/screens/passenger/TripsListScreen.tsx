import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { TripCard } from '../../components/passenger/TripCard';
import { Haptics } from '../../components/ui/Haptics';
import { useApp } from '../../context/AppContext';
import { DetailedTrip } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  ArrowUpDown,
  X,
  Compass,
  Wind,
  Luggage,
  Sparkles,
} from 'lucide-react-native';

interface TripsListScreenProps {
  navigation: any;
  route: any;
}

type FilterCategory = 'ALL' | 'INTERNATIONAL' | 'DOMESTIC';
type SortOption = 'CHEAPEST' | 'FASTEST' | 'RATING';

export const TripsListScreen: React.FC<TripsListScreenProps> = ({
  navigation,
  route,
}) => {
  const { trips } = useApp();
  const initialFrom = route.params?.from || '';
  const initialTo = route.params?.to || '';
  const initialInternational = route.params?.isInternational;

  const [filterCategory, setFilterCategory] = useState<FilterCategory>(
    initialInternational ? 'INTERNATIONAL' : 'ALL'
  );
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyAC, setOnlyAC] = useState(false);
  const [onlyLuggage, setOnlyLuggage] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('CHEAPEST');
  const [searchQuery, setSearchQuery] = useState(initialTo || '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const all = trips.length;
    const intl = trips.filter((t) => t.isInternational).length;
    const dom = trips.filter((t) => !t.isInternational).length;
    return { all, intl, dom };
  }, [trips]);

  // Filtered and sorted trips
  const processedTrips = useMemo(() => {
    let list = [...trips];

    // Category filter
    if (filterCategory === 'INTERNATIONAL') {
      list = list.filter((t) => t.isInternational);
    } else if (filterCategory === 'DOMESTIC') {
      list = list.filter((t) => !t.isInternational);
    }

    // Verified driver filter
    if (onlyVerified) {
      list = list.filter((t) => t.driver.isVerified);
    }

    // AC filter
    if (onlyAC) {
      list = list.filter((t) => t.vehicle.hasAirConditioner);
    }

    // Luggage filter
    if (onlyLuggage) {
      list = list.filter((t) => t.allowLuggage);
    }

    // Search query filter (destination or origin)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.destinationCity.toLowerCase().includes(q) ||
          t.originCity.toLowerCase().includes(q) ||
          t.destinationAddress.toLowerCase().includes(q) ||
          t.originAddress.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortOption === 'CHEAPEST') {
      list.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    } else if (sortOption === 'FASTEST') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortOption === 'RATING') {
      list.sort((a, b) => b.driver.rating - a.driver.rating);
    }

    return list;
  }, [
    trips,
    filterCategory,
    onlyVerified,
    onlyAC,
    onlyLuggage,
    searchQuery,
    sortOption,
  ]);

  const handleSelectTrip = useCallback(
    (tripId: string) => {
      Haptics.selection();
      navigation.navigate('TripDetails', { tripId });
    },
    [navigation]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

  const handleResetFilters = () => {
    Haptics.light();
    setFilterCategory('ALL');
    setOnlyVerified(false);
    setOnlyAC(false);
    setOnlyLuggage(false);
    setSearchQuery('');
    setSortOption('CHEAPEST');
  };

  const keyExtractor = useCallback((item: DetailedTrip) => item.id, []);

  const renderTripItem = useCallback(
    ({ item }: { item: DetailedTrip }) => (
      <TripCard trip={item} onPress={() => handleSelectTrip(item.id)} />
    ),
    [handleSelectTrip]
  );

  return (
    <View style={styles.container}>
      <Header
        title="Mavjud reyslar"
        subtitle={
          initialFrom && initialTo
            ? `${initialFrom} ➔ ${initialTo}`
            : 'Markaziy Osiyo bo\'yicha barcha faol reyslar'
        }
      />

      {/* Search & Filter Top Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.gray[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Shahar yoki bekat bo'yicha qidirish..."
            placeholderTextColor={COLORS.gray[400]}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color={COLORS.gray[400]} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* "Barchasi | Xalqaro 🇰🇿 | Shaharlararo" Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            filterCategory === 'ALL' && styles.tabBtnActive,
          ]}
          onPress={() => {
            Haptics.selection();
            setFilterCategory('ALL');
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              filterCategory === 'ALL' && styles.tabTextActive,
            ]}
          >
            Barchasi ({categoryCounts.all})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            filterCategory === 'INTERNATIONAL' && styles.tabBtnActive,
          ]}
          onPress={() => {
            Haptics.selection();
            setFilterCategory('INTERNATIONAL');
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              filterCategory === 'INTERNATIONAL' && styles.tabTextActive,
            ]}
          >
            Xalqaro 🇰🇿 ({categoryCounts.intl})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            filterCategory === 'DOMESTIC' && styles.tabBtnActive,
          ]}
          onPress={() => {
            Haptics.selection();
            setFilterCategory('DOMESTIC');
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              filterCategory === 'DOMESTIC' && styles.tabTextActive,
            ]}
          >
            Shaharlararo ({categoryCounts.dom})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Filter Chips & Sort Row */}
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            onlyVerified && styles.filterChipActive,
          ]}
          onPress={() => {
            Haptics.light();
            setOnlyVerified(!onlyVerified);
          }}
        >
          <ShieldCheck
            size={13}
            color={onlyVerified ? COLORS.emerald[700] : COLORS.gray[500]}
          />
          <Text
            style={[
              styles.filterChipText,
              onlyVerified && styles.filterChipTextActive,
            ]}
          >
            Tekshirilgan ★
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, onlyAC && styles.filterChipActive]}
          onPress={() => {
            Haptics.light();
            setOnlyAC(!onlyAC);
          }}
        >
          <Wind
            size={13}
            color={onlyAC ? COLORS.emerald[700] : COLORS.gray[500]}
          />
          <Text
            style={[
              styles.filterChipText,
              onlyAC && styles.filterChipTextActive,
            ]}
          >
            Konditsioner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            onlyLuggage && styles.filterChipActive,
          ]}
          onPress={() => {
            Haptics.light();
            setOnlyLuggage(!onlyLuggage);
          }}
        >
          <Luggage
            size={13}
            color={onlyLuggage ? COLORS.emerald[700] : COLORS.gray[500]}
          />
          <Text
            style={[
              styles.filterChipText,
              onlyLuggage && styles.filterChipTextActive,
            ]}
          >
            Yukxona
          </Text>
        </TouchableOpacity>

        {/* Sort Switcher */}
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => {
            Haptics.light();
            setSortOption((prev) =>
              prev === 'CHEAPEST'
                ? 'FASTEST'
                : prev === 'FASTEST'
                ? 'RATING'
                : 'CHEAPEST'
            );
          }}
        >
          <ArrowUpDown size={12} color={COLORS.emerald[700]} />
          <Text style={styles.sortBtnText}>
            {sortOption === 'CHEAPEST'
              ? 'Arzonroq'
              : sortOption === 'FASTEST'
              ? 'Tezroq'
              : 'Reyting'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Optimized FlatList */}
      <FlatList
        data={processedTrips}
        renderItem={renderTripItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={8}
        windowSize={10}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#090D16']}
            tintColor="#090D16"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Compass size={44} color={COLORS.gray[300]} />
            </View>
            <Text style={styles.emptyTitle}>Reyslar topilmadi</Text>
            <Text style={styles.emptyDescription}>
              Tanlangan filtrlar yoki qidiruv so'rovi bo'yicha hozircha bo'sh reyslar yo'q.
            </Text>
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={handleResetFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.resetFiltersBtnText}>Filtrlarni tozalash</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D11',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15171E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    padding: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#15171E',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: '#252934',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FF8800',
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#15171E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  filterChipActive: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterChipTextActive: {
    color: '#0C0D11',
    fontWeight: '800',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1D26',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#272B35',
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 'auto',
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF8800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.gray[800],
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetFiltersBtn: {
    backgroundColor: '#090D16',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    ...SHADOWS.sm,
  },
  resetFiltersBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});
