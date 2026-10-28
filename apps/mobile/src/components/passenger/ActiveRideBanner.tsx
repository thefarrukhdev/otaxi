import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { COLORS } from '../../lib/theme';
import { PassengerBooking } from '../../types';
import { Haptics } from '../ui/Haptics';
import { Phone, ChevronRight, QrCode, ShieldCheck, MapPin } from 'lucide-react-native';

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
      <View style={styles.container}>
        {/* Top Status & Code Header */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressDetails}
          style={styles.mainClickable}
        >
          <View style={styles.topRow}>
            <View style={styles.liveIndicatorRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveStatusText}>Faol safaringiz</Text>
              {isInternational && (
                <View style={styles.flagBadge}>
                  <Text style={styles.flagText}>🇰🇿 Xalqaro</Text>
                </View>
              )}
            </View>

            <View style={styles.pinBadge}>
              <Text style={styles.pinLabel}>KOD:</Text>
              <Text style={styles.pinNumber}>{booking.verificationCode}</Text>
            </View>
          </View>

          {/* Route & Vehicle Info */}
          <View style={styles.routeRow}>
            <Text style={styles.routeText}>
              {booking.trip.originCity} ➔ {booking.trip.destinationCity}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaTime}>
              Jo'nash:{' '}
              {new Date(booking.trip.departureTime).toLocaleTimeString('uz-UZ', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaCar} numberOfLines={1}>
              {booking.trip.vehicle.model} ({booking.trip.vehicle.licensePlate})
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Row */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleCallDriver}
            activeOpacity={0.7}
          >
            <Phone size={13} color="#0F172A" />
            <Text style={styles.actionBtnText}>Qo‘ng‘iroq</Text>
          </TouchableOpacity>

          {isInternational && onOpenChecklist && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnGreen]}
              onPress={onOpenChecklist}
              activeOpacity={0.7}
            >
              <ShieldCheck size={13} color={COLORS.emerald[700]} />
              <Text style={styles.actionBtnTextGreen}>Chegara gidi</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={onPressDetails}
            activeOpacity={0.7}
          >
            <QrCode size={13} color="#475569" />
            <Text style={styles.actionBtnTextMuted}>Bort chiptasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

ActiveRideBanner.displayName = 'ActiveRideBanner';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  mainClickable: {
    padding: 14,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.emerald[600],
  },
  liveStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.emerald[800],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  flagBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  flagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.emerald[700],
  },
  pinNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.emerald[900],
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  metaDot: {
    fontSize: 10,
    color: '#94A3B8',
  },
  metaCar: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  actionBtnOutline: {
    marginLeft: 'auto',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionBtnTextGreen: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  actionBtnTextMuted: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
});
