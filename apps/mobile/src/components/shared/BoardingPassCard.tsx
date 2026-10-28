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
  Clock,
  MapPin,
  Car,
  FileCheck2,
  CheckCircle,
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
          <Text style={styles.codeLabel}>HAYDOVCHIGA AYTILADIGAN 4 XONALI BORT KODI:</Text>
          <View style={styles.codeRow}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{booking.verificationCode}</Text>
            </View>
            <View style={styles.qrMock}>
              <QrCode size={36} color={COLORS.gray[800]} />
              <Text style={styles.qrText}>QR KOD</Text>
            </View>
          </View>
          <Text style={styles.codeHint}>
            Haydovchi sizni avtomobilga qabul qilayotganda ushbu 4 xonali xavfsizlik kodini kiritadi.
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
            <Calendar size={14} color={COLORS.gray[400]} />
            <View>
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
            <Car size={14} color={COLORS.gray[400]} />
            <View>
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
            <MapPin size={14} color={COLORS.gray[400]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Qayerdan</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {booking.trip.originAddress}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <ShieldCheck size={14} color={COLORS.emerald[600]} />
            <View>
              <Text style={styles.detailLabel}>Band o’rindiqlar</Text>
              <Text style={styles.detailValue}>
                {booking.selectedSeats.map((s) => `#${s}`).join(', ')} ({booking.totalPrice.toLocaleString('uz-UZ')} UZS)
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <Button
            title="Haydovchiga qo’ng’iroq"
            variant="outline"
            size="sm"
            onPress={handleCallDriver}
            leftIcon={<Phone size={14} color={COLORS.gray[700]} />}
            style={{ flex: 1 }}
          />

          {isInternational && onOpenChecklist && (
            <Button
              title="Chegara gidi"
              variant="primary"
              size="sm"
              onPress={onOpenChecklist}
              leftIcon={<FileCheck2 size={14} color={COLORS.white} />}
              style={{ flex: 1 }}
            />
          )}

          {onCancelBooking && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Bekor qilish</Text>
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
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
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
    color: COLORS.gray[900],
    letterSpacing: 1,
  },
  flightArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  flightLine: {
    width: 24,
    height: 1.5,
    backgroundColor: COLORS.emerald[600],
  },
  flightArrowText: {
    fontSize: 12,
    color: COLORS.emerald[600],
    fontWeight: '800',
  },
  tripRoute: {
    fontSize: 12,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  codeSection: {
    padding: 16,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald[800],
    letterSpacing: 0.8,
    marginBottom: 8,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  codeBox: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.emerald[500],
    ...SHADOWS.sm,
  },
  codeText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.emerald[800],
    letterSpacing: 6,
    fontVariant: ['tabular-nums'],
  },
  qrMock: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  qrText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.gray[500],
    marginTop: 2,
  },
  codeHint: {
    fontSize: 11,
    color: COLORS.emerald[700],
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  perforationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: COLORS.white,
    position: 'relative',
    overflow: 'hidden',
  },
  leftCutout: {
    width: 16,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1.5,
    borderLeftWidth: 0,
    borderColor: COLORS.gray[200],
  },
  rightCutout: {
    width: 16,
    height: 24,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderColor: COLORS.gray[200],
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginTop: 1,
  },
  plateText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald[700],
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.red[600],
  },
});
