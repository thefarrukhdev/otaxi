import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { COLORS, SHADOWS } from '../lib/theme';
import { PassengerBooking } from '../types';
import { Badge } from './Badge';
import { Phone, QrCode, ShieldAlert, Calendar, Clock, MapPin, XCircle, CheckCircle } from 'lucide-react-native';

interface BoardingPassCardProps {
  booking: PassengerBooking;
  onOpenChecklist?: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const BoardingPassCard: React.FC<BoardingPassCardProps> = ({
  booking,
  onOpenChecklist,
  onCancelBooking,
}) => {
  const isInternational = booking.trip.isInternational;
  const isConfirmed = booking.status === 'CONFIRMED';

  const handleCallDriver = () => {
    Linking.openURL(`tel:${booking.trip.driver.phone}`).catch(() => {
      Alert.alert("Qo'ng'iroq", `Haydovchi raqami: ${booking.trip.driver.phone}`);
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Safarni bekor qilish',
      'Safarni bekor qilmoqchimisiz? Reys jo’nashiga 2 soatdan ko’p vaqt qolganda to’lov 100% to’liq qaytariladi.',
      [
        { text: 'Yo’q, qolsin', style: 'cancel' },
        {
          text: 'Bekor qilish',
          style: 'destructive',
          onPress: () => onCancelBooking && onCancelBooking(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Top Banner */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.tripRoute}>
            {booking.trip.originCity} ➔ {booking.trip.destinationCity}
          </Text>
          <Text style={styles.bookingId}>Bron kodi: #{booking.id}</Text>
        </View>
        <Badge
          label={isConfirmed ? 'Tasdiqlangan' : booking.status}
          variant={isConfirmed ? 'emerald' : 'gray'}
          icon={<CheckCircle size={12} color={COLORS.emerald[700]} />}
        />
      </View>

      {/* Main Boarding Code Highlight */}
      <View style={styles.codeSection}>
        <Text style={styles.codeLabel}>HAYDOVCHIGA KO’RSATISH UCHUN BORTGA CHIQISH KODI:</Text>
        <View style={styles.codeRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{booking.verificationCode}</Text>
          </View>
          <View style={styles.qrMock}>
            <QrCode size={36} color={COLORS.gray[800]} />
            <Text style={styles.qrText}>QR Skaner</Text>
          </View>
        </View>
        <Text style={styles.codeHint}>
          Avtomashinaga o’tirayotganda ushbu 4 xonali kodni haydovchiga ayting yoki QR kodni ko’rsating.
        </Text>
      </View>

      {/* Trip Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Calendar size={14} color={COLORS.gray[400]} />
          <View>
            <Text style={styles.detailLabel}>Sana va vaqt</Text>
            <Text style={styles.detailValue}>
              {new Date(booking.trip.departureTime).toLocaleDateString('uz-UZ', {
                day: 'numeric',
                month: 'short',
              })}{' '}
              • {new Date(booking.trip.departureTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <MapPin size={14} color={COLORS.gray[400]} />
          <View>
            <Text style={styles.detailLabel}>Uchrashuv joyi</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {booking.trip.originAddress}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.seatBadgeSmall}>
            <Text style={styles.seatBadgeText}>
              Joy #{booking.selectedSeats.join(', ')}
            </Text>
          </View>
          <View>
            <Text style={styles.detailLabel}>Avtomobil</Text>
            <Text style={styles.detailValue}>
              {booking.trip.vehicle.make} {booking.trip.vehicle.model} ({booking.trip.vehicle.licensePlate})
            </Text>
          </View>
        </View>
      </View>

      {/* Driver info & Call */}
      <View style={styles.driverSection}>
        <View style={styles.driverLeft}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitials}>{booking.trip.driver.fullName.slice(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.driverName}>{booking.trip.driver.fullName}</Text>
            <Text style={styles.driverPhone}>{booking.trip.driver.phone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={handleCallDriver} activeOpacity={0.8}>
          <Phone size={14} color={COLORS.emerald[700]} />
          <Text style={styles.callButtonText}>Qo’ng’iroq</Text>
        </TouchableOpacity>
      </View>

      {/* International checklist shortcut if cross-border */}
      {isInternational && (
        <TouchableOpacity style={styles.checklistBanner} onPress={onOpenChecklist} activeOpacity={0.8}>
          <ShieldAlert size={16} color={COLORS.blue[600]} />
          <Text style={styles.checklistBannerText}>
            Xalqaro reys: Davlat chegarasi o’tish chek-listini ko’rish
          </Text>
        </TouchableOpacity>
      )}

      {/* Cancel option */}
      {isConfirmed && onCancelBooking && (
        <TouchableOpacity style={styles.cancelLink} onPress={handleCancel}>
          <XCircle size={14} color={COLORS.red[500]} />
          <Text style={styles.cancelLinkText}>Safarni bekor qilish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    marginBottom: 16,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.gray[900],
  },
  bookingId: {
    fontSize: 11,
    color: COLORS.gray[400],
    marginTop: 2,
    fontWeight: '600',
  },
  codeSection: {
    backgroundColor: COLORS.emerald[50],
    borderRadius: 14,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.emerald[300],
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald[800],
    letterSpacing: 0.5,
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
    paddingVertical: 10,
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
  },
  qrMock: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  qrText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[600],
    marginTop: 2,
  },
  codeHint: {
    fontSize: 11,
    color: COLORS.emerald[900],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
    fontWeight: '500',
  },
  detailsGrid: {
    gap: 8,
    marginVertical: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.gray[400],
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[800],
  },
  seatBadgeSmall: {
    backgroundColor: COLORS.emerald[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seatBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald[800],
  },
  driverSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitials: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  driverPhone: {
    fontSize: 11,
    color: COLORS.gray[500],
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.emerald[300],
    gap: 4,
  },
  callButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  checklistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blue[50],
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.blue[200],
    gap: 8,
    marginTop: 10,
  },
  checklistBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.blue[800],
    flex: 1,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  cancelLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.red[600],
  },
});
