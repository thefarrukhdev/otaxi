import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PassengerBooking } from '../../types';
import { ChevronRight } from 'lucide-react-native';

export interface ActiveRideBannerProps {
  booking: PassengerBooking;
  onPressDetails?: () => void;
  onOpenChecklist?: () => void;
}

export const ActiveRideBanner: React.FC<ActiveRideBannerProps> = React.memo(
  ({ booking, onPressDetails, onOpenChecklist }) => {
    const isInternational = booking.trip.isInternational;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressDetails}
        style={styles.container}
      >
        <View style={styles.contentRow}>
          {/* Left info */}
          <View style={styles.leftInfo}>
            <View style={styles.statusRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusLabel}>FAOL SAFAR</Text>
              {isInternational && <Text style={styles.statusLabel}>• XALQARO</Text>}
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.timeText}>
                Bugun,{' '}
                {new Date(booking.trip.departureTime).toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            <Text style={styles.routeText}>
              {booking.trip.originCity} → {booking.trip.destinationCity}
            </Text>

            <Text style={styles.subText}>{booking.trip.vehicle.model}</Text>
          </View>

          {/* Right Verification Code */}
          <View style={styles.rightSection}>
            <View style={styles.codeColumn}>
              <Text style={styles.codeLabel}>Kod</Text>
              <Text style={styles.codeValue}>#{booking.verificationCode}</Text>
            </View>
            <ChevronRight size={18} color="#64748B" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

ActiveRideBanner.displayName = 'ActiveRideBanner';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#15171E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftInfo: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8800',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF8800',
    letterSpacing: 0.5,
  },
  flag: {
    fontSize: 11,
  },
  metaDot: {
    fontSize: 10,
    color: '#475569',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  routeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  subText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  codeColumn: {
    alignItems: 'flex-end',
  },
  codeLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  codeValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
  },
});
