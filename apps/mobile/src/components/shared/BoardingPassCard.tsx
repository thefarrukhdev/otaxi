import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { PassengerBooking } from '../../types';
import { Badge } from '../ui/Badge';
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
            <Badge
              label={isConfirmed ? 'Tasdiqlangan' : booking.status}
              variant={isConfirmed ? 'success' : 'neutral'}
              icon={<CheckCircle size={12} color={COLORS.emerald[700]} />}
            />
            {isInternational && (
              <Badge label="Xalqaro" variant="international" flag="KZ" />
            )}
          </View>
        </View>

        {/* Boarding Code Security Highlight Banner */}
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>HAYDOVCHIGA AYTILADIGAN 4 XONALI BORT KODI</Text>
          
          <View style={styles.codeRow}>
            <View style={styles.digitsRow}>
              {digits.map((digit, index) => (
                <View key={index} style={styles.digitBox}>
                  <Text style={styles.digitText}>{digit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.qrBadge}>
              <QrCode size={28} color="#0F172A" />
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
            <Calendar size={15} color={COLORS.gray[400]} />
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
            <Car size={15} color={COLORS.gray[400]} />
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
            <MapPin size={15} color={COLORS.gray[400]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Qayerdan</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {booking.trip.originAddress}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <ShieldCheck size={15} color={COLORS.emerald[600]} />
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
              <Phone size={14} color="#0F172A" />
              <Text style={styles.callButtonText}>Haydovchiga qo‘ng‘iroq</Text>
            </TouchableOpacity>

            {isInternational && onOpenChecklist && (
              <TouchableOpacity
                style={styles.guideButton}
                onPress={onOpenChecklist}
                activeOpacity={0.8}
              >
                <FileCheck2 size={14} color={COLORS.white} />
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
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#0F172A',
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
    backgroundColor: COLORS.emerald[500],
    borderRadius: 1,
  },
  flightArrowText: {
    fontSize: 12,
    color: COLORS.emerald[600],
    fontWeight: '800',
  },
  tripRoute: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  codeSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
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
    width: 42,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'monospace',
  },
  qrBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#475569',
    marginTop: 2,
  },
  codeHint: {
    fontSize: 11,
    color: '#64748B',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#E2E8F0',
  },
  rightCutout: {
    width: 14,
    height: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#E2E8F0',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    color: '#0F172A',
    marginTop: 1,
  },
  plateText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald[700],
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  cardActionsContainer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
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
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  callButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  guideButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.emerald[600],
  },
  guideButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.white,
  },
  cancelLink: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 4,
  },
  cancelLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
});
