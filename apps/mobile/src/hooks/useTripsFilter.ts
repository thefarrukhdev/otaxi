import { useState, useMemo, useCallback } from 'react';
import { DetailedTrip } from '../types';

export type TripFilterTab = 'ALL' | 'INTERNATIONAL' | 'INTERCITY';
export type TripSortOrder = 'DEPARTURE_ASC' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING_DESC' | 'SEATS_DESC';

export interface UseTripsFilterProps {
  trips: DetailedTrip[];
  initialTab?: TripFilterTab;
  initialQuery?: string;
  initialVerifiedOnly?: boolean;
  initialSortOrder?: TripSortOrder;
}

export interface TripFilterStats {
  total: number;
  internationalCount: number;
  intercityCount: number;
  verifiedCount: number;
  filteredCount: number;
  minPriceAvailable: number;
  maxPriceAvailable: number;
}

/**
 * useTripsFilter
 * 
 * Reyslar ro'yxatini filtrlash, qidirish va saralash uchun
 * useMemo bilan maksimal optimallashgan hook.
 */
export const useTripsFilter = ({
  trips,
  initialTab = 'ALL',
  initialQuery = '',
  initialVerifiedOnly = false,
  initialSortOrder = 'DEPARTURE_ASC',
}: UseTripsFilterProps) => {
  // Filter States
  const [activeTab, setActiveTab] = useState<TripFilterTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(initialVerifiedOnly);
  const [sortOrder, setSortOrder] = useState<TripSortOrder>(initialSortOrder);
  const [filterAC, setFilterAC] = useState<boolean>(false);
  const [filterLuggage, setFilterLuggage] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minSeats, setMinSeats] = useState<number | undefined>(undefined);

  // Overall statistics memoized across trips dataset
  const stats = useMemo<TripFilterStats>(() => {
    let intl = 0;
    let inter = 0;
    let verified = 0;
    let minP = trips.length > 0 ? trips[0].pricePerSeat : 0;
    let maxP = trips.length > 0 ? trips[0].pricePerSeat : 0;

    for (const t of trips) {
      if (t.isInternational) intl++;
      else inter++;

      if (t.driver.isVerified) verified++;

      if (t.pricePerSeat < minP) minP = t.pricePerSeat;
      if (t.pricePerSeat > maxP) maxP = t.pricePerSeat;
    }

    return {
      total: trips.length,
      internationalCount: intl,
      intercityCount: inter,
      verifiedCount: verified,
      filteredCount: 0, // will be updated below
      minPriceAvailable: minP,
      maxPriceAvailable: maxP,
    };
  }, [trips]);

  // Main filtered & sorted result
  const filteredTrips = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filtered = trips.filter((trip) => {
      // 1. Tab filter (All / International / Domestic Intercity)
      if (activeTab === 'INTERNATIONAL' && !trip.isInternational) return false;
      if (activeTab === 'INTERCITY' && trip.isInternational) return false;

      // 2. Driver verification
      if (onlyVerified && !trip.driver.isVerified) return false;

      // 3. Vehicle amenities
      if (filterAC && !trip.vehicle.hasAirConditioner) return false;
      if (filterLuggage && !trip.allowLuggage) return false;

      // 4. Seats availability
      if (minSeats !== undefined && trip.availableSeats < minSeats) return false;

      // 5. Price bounds
      if (minPrice !== undefined && trip.pricePerSeat < minPrice) return false;
      if (maxPrice !== undefined && trip.pricePerSeat > maxPrice) return false;

      // 6. Search query (Origin, Destination, Driver, Stops, Vehicle)
      if (trimmedQuery) {
        const matchDest = trip.destinationCity.toLowerCase().includes(trimmedQuery);
        const matchOrigin = trip.originCity.toLowerCase().includes(trimmedQuery);
        const matchDriver = trip.driver.fullName.toLowerCase().includes(trimmedQuery);
        const matchVehicle = `${trip.vehicle.make} ${trip.vehicle.model}`.toLowerCase().includes(trimmedQuery);
        const matchStops = trip.stops?.some((s) => s.cityName.toLowerCase().includes(trimmedQuery)) ?? false;

        if (!matchDest && !matchOrigin && !matchDriver && !matchVehicle && !matchStops) {
          return false;
        }
      }

      return true;
    });

    // Sort comparator
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'PRICE_ASC':
          return a.pricePerSeat - b.pricePerSeat;
        case 'PRICE_DESC':
          return b.pricePerSeat - a.pricePerSeat;
        case 'RATING_DESC':
          return b.driver.rating - a.driver.rating;
        case 'SEATS_DESC':
          return b.availableSeats - a.availableSeats;
        case 'DEPARTURE_ASC':
        default: {
          const timeA = new Date(a.departureTime).getTime();
          const timeB = new Date(b.departureTime).getTime();
          return timeA - timeB;
        }
      }
    });
  }, [
    trips,
    activeTab,
    searchQuery,
    onlyVerified,
    sortOrder,
    filterAC,
    filterLuggage,
    minPrice,
    maxPrice,
    minSeats,
  ]);

  // Check if any filter other than default tab is applied
  const hasActiveFilters = useMemo(() => {
    return (
      activeTab !== 'ALL' ||
      searchQuery.trim().length > 0 ||
      onlyVerified ||
      filterAC ||
      filterLuggage ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minSeats !== undefined ||
      sortOrder !== 'DEPARTURE_ASC'
    );
  }, [
    activeTab,
    searchQuery,
    onlyVerified,
    filterAC,
    filterLuggage,
    minPrice,
    maxPrice,
    minSeats,
    sortOrder,
  ]);

  const resetFilters = useCallback(() => {
    setActiveTab('ALL');
    setSearchQuery('');
    setOnlyVerified(false);
    setSortOrder('DEPARTURE_ASC');
    setFilterAC(false);
    setFilterLuggage(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinSeats(undefined);
  }, []);

  const dynamicStats = useMemo(() => {
    return {
      ...stats,
      filteredCount: filteredTrips.length,
    };
  }, [stats, filteredTrips.length]);

  return {
    filteredTrips,
    stats: dynamicStats,
    hasActiveFilters,

    // Tab state
    activeTab,
    setActiveTab,

    // Query state
    searchQuery,
    setSearchQuery,

    // Verification
    onlyVerified,
    setOnlyVerified,

    // Sorting
    sortOrder,
    setSortOrder,

    // Amenities
    filterAC,
    setFilterAC,
    filterLuggage,
    setFilterLuggage,

    // Price & Seats
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minSeats,
    setMinSeats,

    // Actions
    resetFilters,
  };
};

export default useTripsFilter;
