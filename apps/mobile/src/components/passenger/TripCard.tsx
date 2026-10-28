import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { DetailedTrip } from '../../types';
import { Badge } from '../ui/Badge';
import { Haptics } from '../ui/Haptics';
import {
  Star,
  ShieldCheck,
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
  const [imageError, setImageError] = useState(false);

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

  const driverInitials = trip.driver.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isLowSeats = trip.availableSeats === 1;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`Reys ${trip.originCity} dan ${trip.destinationCity} ga`}
    >
      {/* Top Badges Row */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          {trip.isInternational ? (
            <Badge
              label={`Xalqaro ${destFlag}`}
              variant="international"
            />
          ) : (
            <Badge label="Shaharlararo 🇺🇿" variant="success" />
          )}

          {trip.driver.isVerified && (
            <Badge
              label="Tekshirilgan haydovchi ★"
              variant="success"
              icon={<ShieldCheck size={12} color={COLORS.emerald[700]} />}
            />
          )}
        </View>

        <View style={[styles.seatsPill, isLowSeats && styles.seatsPillWarning]}>
          <Text style={[styles.seatsText, isLowSeats && styles.seatsTextWarning]}>
            {isLowSeats ? "Oxirgi 1 ta bo'sh joy!" : `${trip.availableSeats} ta bo'sh o'rindiq`}
          </Text>
        </View>
      </View>

      {/* Timeline Section */}
      <View style={styles.timelineRow}>
        <View style={styles.timePoint}>
          <Text style={styles.timeText}>{departureTime}</Text>
          <Text style={styles.cityName}>{trip.originCity}</Text>
          <Text style={styles.addressName} numberOfLines={1}>
            {trip.originAddress}
          </Text>
        </View>

        <View style={styles.timelineMiddle}>
          <View style={styles.durationBadge}>
            <Clock size={11} color={COLORS.gray[500]} />
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
          {!imageError && trip.driver.photoUrl ? (
            <Image
              source={{ uri: trip.driver.photoUrl }}
              style={styles.driverAvatar}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.driverAvatarFallback}>
              <Text style={styles.driverAvatarText}>{driverInitials}</Text>
            </View>
          )}

          <View style={styles.driverDetails}>
            <Text style={styles.driverName} numberOfLines={1}>
              {trip.driver.fullName}
            </Text>
            <View style={styles.ratingRow}>
              <Star size={13} color={COLORS.amber[500]} fill={COLORS.amber[500]} />
              <Text style={styles.ratingText}>
                {trip.driver.rating.toFixed(2)}★
              </Text>
              <Text style={styles.reviewsCount}>
                ({trip.driver.totalTrips} ta safar)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.vehicleInfo}>
          <View style={styles.carModelRow}>
            <Car size={13} color={COLORS.gray[600]} />
            <Text style={styles.carModelText} numberOfLines={1}>
              {trip.vehicle.make} {trip.vehicle.model}
            </Text>
          </View>
          <View style={styles.amenitiesIcons}>
            {trip.vehicle.hasAirConditioner && (
              <View style={styles.amenityChip}>
                <Wind size={11} color={COLORS.emerald[700]} />
                <Text style={styles.amenityChipText}>Konditsioner</Text>
              </View>
            )}
            {trip.allowLuggage && (
              <View style={styles.amenityChip}>
                <Luggage size={11} color={COLORS.gray[600]} />
                <Text style={styles.amenityChipText}>Yukxona</Text>
              </View>
            )}
            {trip.vehicle.hasPhoneCharging && (
              <BatteryCharging size={13} color={COLORS.blue[600]} />
            )}
            {trip.vehicle.noSmoking && (
              <CigaretteOff size={13} color={COLORS.gray[500]} />
            )}
          </View>
        </View>
      </View>

      {/* Bottom Price & Call To Action */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.priceLabel}>1 ta o'rindiq narxi:</Text>
          <Text style={styles.priceValue}>
            {trip.pricePerSeat.toLocaleString('uz-UZ')}{' '}
            <Text style={styles.priceCurrency}>{trip.currency}</Text>
          </Text>
        </View>

        <View style={styles.bookButtonFake}>
          <Text style={styles.bookButtonText}>Tanlash</Text>
          <ChevronRight size={16} color={COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

TripCard.displayName = 'TripCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  seatsPill: {
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  seatsPillWarning: {
    backgroundColor: COLORS.red[50],
    borderColor: COLORS.red[200],
  },
  seatsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  seatsTextWarning: {
    color: COLORS.red[600],
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  timePoint: {
    flex: 1,
  },
  timeText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.gray[900],
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  cityName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray[800],
    marginTop: 2,
  },
  addressName: {
    fontSize: 11,
    color: COLORS.gray[400],
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
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[600],
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
    backgroundColor: COLORS.emerald[600],
  },
  lineDash: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.gray[300],
  },
  lineDotRight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald[600],
  },
  directPill: {
    marginTop: 4,
  },
  directPillText: {
    fontSize: 10,
    color: COLORS.emerald[700],
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
    backgroundColor: COLORS.gray[200],
  },
  driverAvatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.emerald[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[800],
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[900],
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
    color: COLORS.gray[800],
    fontVariant: ['tabular-nums'],
  },
  reviewsCount: {
    fontSize: 11,
    color: COLORS.gray[400],
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
    color: COLORS.gray[700],
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
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  amenityChipText: {
    fontSize: 9,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.gray[500],
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.emerald[700],
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  priceCurrency: {
    fontSize: 12,
    fontWeight: '700',
  },
  bookButtonFake: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.emerald[600],
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    ...SHADOWS.sm,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});
