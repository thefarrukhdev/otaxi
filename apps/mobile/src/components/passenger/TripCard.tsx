import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { DetailedTrip } from '../../types';
import { Haptics } from '../ui/Haptics';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { PriceDisplay } from '../ui/PriceDisplay';
import {
  Star,
  Clock,
  Car,
  ChevronRight,
  Wind,
  Luggage,
  BatteryCharging,
  CigaretteOff,
} from 'lucide-react-native';

export interface TripCardProps {
  trip: DetailedTrip;
  onPress: () => void;
}

const formatClockTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  } catch {
    return '00:00';
  }
};

const getCountryFlag = (countryCode: string): string => {
  switch (countryCode) {
    case 'KZ':
      return '🇰🇿';
    case 'KG':
      return '🇰🇬';
    case 'TJ':
      return '🇹🇯';
    case 'AF':
      return '🇦🇫';
    case 'TM':
      return '🇹🇲';
    case 'UZ':
    default:
      return '🇺🇿';
  }
};

export const TripCard: React.FC<TripCardProps> = React.memo(({ trip, onPress }) => {
  const departureTime = formatClockTime(trip.departureTime);
  const arrivalTime = formatClockTime(trip.estimatedArrivalTime);

  const durationHours = Math.floor(trip.durationMinutes / 60);
  const durationMins = trip.durationMinutes % 60;
  const durationStr =
    durationMins > 0 ? `${durationHours}s ${durationMins}m` : `${durationHours} soat`;

  const destFlag = getCountryFlag(trip.destinationCountry);

  const handlePress = () => {
    Haptics.selection();
    onPress();
  };

  const isLowSeats = trip.availableSeats === 1;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`Reys ${trip.originCity} dan ${trip.destinationCity} ga`}
    >
      {/* Top Meta Row */}
      <View style={styles.topRow}>
        {trip.isInternational ? (
          <Badge label="Xalqaro" flag="KZ" variant="brand" size="sm" />
        ) : trip.departureType === 'WHEN_FULL' ? (
          <Badge label="To’lsa ketamiz" variant="brand" size="sm" />
        ) : (
          <Badge label="Shaharlararo" variant="neutral" size="sm" />
        )}

        <Text style={[styles.seatsText, isLowSeats && styles.seatsTextWarning]}>
          {isLowSeats ? "Oxirgi 1 ta joy!" : `${trip.availableSeats} ta bo'sh joy`}
        </Text>
      </View>

      {/* Timeline Section */}
      <View style={styles.timelineRow}>
        <View style={styles.timePoint}>
          <Text style={[styles.timeText, trip.departureType === 'WHEN_FULL' && styles.timeTextWhenFull]}>
            {trip.departureType === 'WHEN_FULL' ? "To'lganda" : departureTime}
          </Text>
          <Text style={styles.cityName}>{trip.originCity}</Text>
          <Text style={styles.addressName} numberOfLines={1}>
            {trip.originAddress}
          </Text>
        </View>

        <View style={styles.timelineMiddle}>
          <View style={styles.durationBadge}>
            <Clock size={11} color="#94A3B8" />
            <Text style={styles.durationText}>{durationStr}</Text>
          </View>
          <View style={styles.timelineLine}>
            <View style={styles.lineDotLeft} />
            <View style={styles.lineDash} />
            <View style={styles.lineDotRight} />
          </View>
          <View style={styles.directPill}>
            <Text style={styles.directPillText}>
              {trip.stops.length > 0
                ? `${trip.stops.length} ta oraliq to'xtash`
                : "To'g'ridan-to'g'ri"}
            </Text>
          </View>
        </View>

        <View style={[styles.timePoint, { alignItems: 'flex-end' }]}>
          <Text style={styles.timeText}>{arrivalTime}</Text>
          <Text style={styles.cityName}>{trip.destinationCity}</Text>
          <Text style={[styles.addressName, { textAlign: 'right' }]} numberOfLines={1}>
            {trip.destinationAddress}
          </Text>
        </View>
      </View>

      {/* Driver, Car & Amenities Row */}
      <View style={styles.driverSection}>
        <View style={styles.driverInfo}>
          <Avatar
            source={trip.driver.photoUrl}
            name={trip.driver.fullName}
            size="md"
            isVerified={trip.driver.isVerified}
          />

          <View style={styles.driverDetails}>
            <Text style={styles.driverName} numberOfLines={1}>
              {trip.driver.fullName}
            </Text>
            <View style={styles.ratingRow}>
              <Star size={13} color="#FF8800" fill="#FF8800" />
              <Text style={styles.ratingText}>
                {trip.driver.rating.toFixed(2)}★
              </Text>
              <Text style={styles.reviewsCount}>
                ({trip.driver.totalTrips})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.vehicleInfo}>
          <View style={styles.carModelRow}>
            <Car size={13} color="#94A3B8" />
            <Text style={styles.carModelText} numberOfLines={1}>
              {trip.vehicle.make} {trip.vehicle.model}
            </Text>
          </View>
          <View style={styles.amenitiesIcons}>
            {trip.vehicle.hasAirConditioner && (
              <View style={styles.amenityChip}>
                <Wind size={11} color="#FF8800" />
                <Text style={styles.amenityChipText}>Konditsioner</Text>
              </View>
            )}
            {trip.allowLuggage && (
              <View style={styles.amenityChip}>
                <Luggage size={11} color="#94A3B8" />
                <Text style={styles.amenityChipText}>
                  {trip.vehicle.trunkCapacity === 'LIMITED' ? 'Kichik bagaj (Metan)' : 'Katta bagaj'}
                </Text>
              </View>
            )}
            {trip.vehicle.hasPhoneCharging && (
              <BatteryCharging size={13} color="#60A5FA" />
            )}
            {trip.vehicle.noSmoking && (
              <CigaretteOff size={13} color="#64748B" />
            )}
          </View>
        </View>
      </View>

      {/* Bottom Price & Call To Action */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.priceLabel}>1 ta o'rindiq:</Text>
          <PriceDisplay
            amount={trip.pricePerSeat}
            currency={trip.currency}
            size="md"
          />
          {trip.seats[0]?.priceDelta ? (
            <Text style={styles.frontSeatPriceHint}>
              Old o’rindiq: {(trip.pricePerSeat + trip.seats[0].priceDelta).toLocaleString('uz-UZ')} UZS
            </Text>
          ) : null}
        </View>

        <View style={styles.bookButtonFake}>
          <Text style={styles.bookButtonText}>Tanlash</Text>
          <ChevronRight size={16} color="#0C0D11" strokeWidth={2.8} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

TripCard.displayName = 'TripCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#15171E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  intlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  whenFullText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  domesticText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  seatsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
  },
  seatsTextWarning: {
    color: '#F87171',
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E222A',
  },
  timePoint: {
    flex: 1,
  },
  timeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  timeTextWhenFull: {
    fontSize: 16,
    color: '#FF8800',
    fontWeight: '800',
  },
  cityName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  addressName: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  timelineMiddle: {
    alignItems: 'center',
    paddingHorizontal: 8,
    minWidth: 100,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 5,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  timelineLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  lineDotLeft: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8800',
  },
  lineDash: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#272B35',
  },
  lineDotRight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8800',
  },
  directPill: {
    marginTop: 4,
  },
  directPillText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  driverSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1D2029',
  },
  driverAvatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#252934',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  driverAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF8800',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
  },
  reviewsCount: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 2,
  },
  vehicleInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  carModelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carModelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  amenitiesIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1D2029',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  amenityChipText: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E222A',
  },
  priceLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  frontSeatPriceHint: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  priceCurrency: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9E2C',
  },
  bookButtonFake: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF8800',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0C0D11',
  },
});
