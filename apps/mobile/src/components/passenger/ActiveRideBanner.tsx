import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { PassengerBooking } from '../../types';
import { Haptics } from '../ui/Haptics';
import { Phone, ChevronRight, QrCode } from 'lucide-react-native';

export interface ActiveRideBannerProps {
  booking: PassengerBooking;
  onPressDetails?: () => void;
  onOpenChecklist?: () => void;
}

export const ActiveRideBanner: React.FC<ActiveRideBannerProps> = React.memo(
  ({ booking, onPressDetails, onOpenChecklist }) => {
    const isInternational = booking.trip.isInternational;

    const handleCallDriver = () => {
      Haptics.light();
      Linking.openURL(`tel:${booking.trip.driver.phone}`).catch(() => {
        Alert.alert("Qo'ng'iroq", `Haydovchi raqami: ${booking.trip.driver.phone}`);
      });
    };

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
              {isInternational && <Text style={styles.flag}>🇰🇿</Text>}
            </View>

            <Text style={styles.routeText}>
              {booking.trip.originCity} → {booking.trip.destinationCity}
            </Text>

            <Text style={styles.subText}>
              Bugun,{' '}
              {new Date(booking.trip.departureTime).toLocaleTimeString('uz-UZ', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              • {booking.trip.vehicle.model}
            </Text>
          </View>

          {/* Right PIN & Action */}
          <View style={styles.rightSection}>
            <View style={styles.pinTag}>
              <Text style={styles.pinLabel}>BORT KODI</Text>
              <Text style={styles.pinValue}>{booking.verificationCode}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleCallDriver}
                style={styles.iconCircle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Phone size={13} color="#0F172A" />
              </TouchableOpacity>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

ActiveRideBanner.displayName = 'ActiveRideBanner';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    backgroundColor: '#059669',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  flag: {
    fontSize: 11,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  pinTag: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  pinValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
