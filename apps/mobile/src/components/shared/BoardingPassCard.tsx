import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { PassengerBooking } from '../../types';
import { Button } from '../ui/Button';
import { Haptics } from '../ui/Haptics';
import {
  Phone,
  QrCode,
  ShieldCheck,
  Calendar,
  MapPin,
  Car,
  FileCheck2,
  CheckCircle,
  Clock,
} from 'lucide-react-native';

export interface BoardingPassCardProps {
  booking: PassengerBooking;
  onOpenChecklist?: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

const CITY_CODES: Record<string, string> = {
  Toshkent: 'TAS',
  Samarqand: 'SKD',
  Buxoro: 'BHK',
  Shymkent: 'CIT',
  Bishkek: 'FRU',
  "Xo'jand": 'LBD',
  Andijon: 'AZN',
  Namangan: 'NMA',
};

export const BoardingPassCard: React.FC<BoardingPassCardProps> = React.memo(
  ({ booking, onOpenChecklist, onCancelBooking }) => {
    const isInternational = booking.trip.isInternational;
    const isConfirmed = booking.status === 'CONFIRMED';

    const originCode = CITY_CODES[booking.trip.originCity] || booking.trip.originCity.slice(0, 3).toUpperCase();
    const destCode = CITY_CODES[booking.trip.destinationCity] || booking.trip.destinationCity.slice(0, 3).toUpperCase();

    const handleCallDriver = () => {
      Haptics.light();
      Linking.openURL(`tel:${booking.trip.driver.phone}`).catch(() => {
        Alert.alert("Qo'ng'iroq", `Haydovchi raqami: ${booking.trip.driver.phone}`);
      });
    };

    const handleCancel = () => {
      Haptics.warning();
      Alert.alert(
        'Safarni bekor qilish',
        'Safarni bekor qilmoqchimisiz? Reys jo’nashiga 2 soatdan ko’p vaqt qolganda to’lov 100% qaytariladi.',
        [
          { text: 'Yo’q, qolsin', style: 'cancel' },
          {
            text: 'Bekor qilish',
            style: 'destructive',
            onPress: () => {
              Haptics.error();
              onCancelBooking?.(booking.id);
            },
          },
        ]
      );
    };

    const digits = (booking.verificationCode || '1234').split('');

    return (
      <View style={styles.card}>
        {/* Top Header Ticket Band */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.routeCodeRow}>
              <Text style={styles.airportCode}>{originCode}</Text>
              <View style={styles.flightArrowContainer}>
                <View style={styles.flightLine} />
                <Text style={styles.flightArrowText}>➔</Text>
              </View>
              <Text style={styles.airportCode}>{destCode}</Text>
            </View>
            <Text style={styles.tripRoute}>
              {booking.trip.originCity} — {booking.trip.destinationCity}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.confirmedRow}>
              <CheckCircle size={13} color="#10B981" />
              <Text style={styles.confirmedText}>{isConfirmed ? 'Tasdiqlangan' : booking.status}</Text>
            </View>
            {isInternational && (
              <Text style={styles.intlText}>🇰🇿 Xalqaro</Text>
            )}
          </View>
        </View>

        {/* Boarding Code Security Highlight Banner */}
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>HAYDOVCHIGA AYTILADIGAN TASDIQLASH KODI</Text>
          
          <View style={styles.codeRow}>
            <View style={styles.digitsRow}>
              {digits.map((digit, index) => (
                <View key={index} style={styles.digitBox}>
                  <Text style={styles.digitText}>{digit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.qrBadge}>
              <QrCode size={28} color="#FF8800" />
              <Text style={styles.qrBadgeText}>QR KOD</Text>
            </View>
          </View>

          <Text style={styles.codeHint}>
            Haydovchi sizni avtomobilga qabul qilayotganda ushbu 4 xonali kodni tekshiradi.
          </Text>
        </View>

        {/* Perforated Ticket Divider Line */}
        <View style={styles.perforationWrapper}>
          <View style={styles.leftCutout} />
          <View style={styles.dashedLine} />
          <View style={styles.rightCutout} />
        </View>

        {/* Trip Meta Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Calendar size={15} color="#94A3B8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Jo’nash vaqti</Text>
              <Text style={styles.detailValue}>
                {new Date(booking.trip.departureTime).toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                ({new Date(booking.trip.departureTime).toLocaleDateString('uz-UZ', {
                  day: 'numeric',
                  month: 'short',
                })})
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Car size={15} color="#94A3B8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Avtomobil</Text>
              <Text style={styles.detailValue}>
                {booking.trip.vehicle.make} {booking.trip.vehicle.model}
              </Text>
              <Text style={styles.plateText}>{booking.trip.vehicle.licensePlate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <MapPin size={15} color="#94A3B8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Qayerdan</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {booking.trip.originAddress}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <ShieldCheck size={15} color="#FF8800" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Band o’rindiqlar</Text>
              <Text style={styles.detailValue}>
                {booking.selectedSeats.map((s) => `#${s}`).join(', ')} ({booking.totalPrice.toLocaleString('uz-UZ')} UZS)
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.cardActionsContainer}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallDriver}
              activeOpacity={0.8}
            >
              <Phone size={14} color="#FF8800" />
              <Text style={styles.callButtonText}>Haydovchiga qo‘ng‘iroq</Text>
            </TouchableOpacity>

            {isInternational && onOpenChecklist && (
              <TouchableOpacity
                style={styles.guideButton}
                onPress={onOpenChecklist}
                activeOpacity={0.8}
              >
                <FileCheck2 size={14} color="#0C0D11" strokeWidth={2.5} />
                <Text style={styles.guideButtonText}>Chegara gidi</Text>
              </TouchableOpacity>
            )}
          </View>

          {onCancelBooking && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelLink} activeOpacity={0.7}>
              <Text style={styles.cancelLinkText}>Safarni bekor qilish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

BoardingPassCard.displayName = 'BoardingPassCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#15171E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#272B35',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1D2029',
    borderBottomWidth: 1,
    borderBottomColor: '#272B35',
  },
  headerLeft: {
    flex: 1,
  },
  routeCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  airportCode: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  flightArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  flightLine: {
    width: 24,
    height: 2,
    backgroundColor: '#FF8800',
    borderRadius: 1,
  },
  flightArrowText: {
    fontSize: 12,
    color: '#FF8800',
    fontWeight: '800',
  },
  tripRoute: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confirmedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  intlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  codeSection: {
    padding: 16,
    backgroundColor: '#15171E',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  digitsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  digitBox: {
    width: 44,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#0C0D11',
    borderWidth: 1.5,
    borderColor: '#272B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF8800',
    fontFamily: 'monospace',
  },
  qrBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1D2029',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  qrBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 2,
  },
  codeHint: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  perforationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 20,
    marginVertical: 4,
  },
  leftCutout: {
    width: 14,
    height: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#0C0D11',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#272B35',
  },
  rightCutout: {
    width: 14,
    height: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#0C0D11',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#272B35',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#272B35',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 7,
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  plateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF8800',
    backgroundColor: 'rgba(255, 136, 0, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  cardActionsContainer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#1E222A',
    backgroundColor: '#12141A',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#1D2029',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  callButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guideButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FF8800',
  },
  guideButtonText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0C0D11',
  },
  cancelLink: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 4,
  },
  cancelLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F87171',
  },
});
