import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../lib/theme';
import { SeatInfo } from '../types';
import { Disc, Check } from 'lucide-react-native';

interface SeatMapProps {
  seats: SeatInfo[];
  selectedSeats: number[];
  onToggleSeat: (seatNumber: number) => void;
  basePrice: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onToggleSeat, basePrice }) => {
  const getSeat = (num: number) => seats.find((s) => s.seatNumber === num);

  const renderSeat = (num: number, label: string) => {
    const seat = getSeat(num);
    const isAvailable = seat ? seat.isAvailable : false;
    const isSelected = selectedSeats.includes(num);
    const extraPrice = seat ? seat.priceDelta : 0;
    const finalPrice = basePrice + extraPrice;

    return (
      <TouchableOpacity
        key={num}
        style={[
          styles.seatBox,
          !isAvailable && styles.seatOccupied,
          isSelected && styles.seatSelected,
          isAvailable && !isSelected && styles.seatAvailable,
        ]}
        disabled={!isAvailable}
        onPress={() => onToggleSeat(num)}
        activeOpacity={0.7}
      >
        <View style={styles.seatTopPillow} />
        <View style={styles.seatContent}>
          {isSelected ? (
            <Check size={18} color={COLORS.white} />
          ) : (
            <Text style={[styles.seatNum, !isAvailable ? styles.textOccupied : styles.textAvailable]}>
              #{num}
            </Text>
          )}
          <Text
            style={[
              styles.seatLabel,
              isSelected ? styles.textSelected : !isAvailable ? styles.textOccupied : styles.textAvailable,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
        {isAvailable && (
          <View style={[styles.priceTag, isSelected && styles.priceTagSelected]}>
            <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
              {finalPrice.toLocaleString('uz-UZ')} UZS
            </Text>
          </View>
        )}
        {!isAvailable && (
          <View style={styles.occupiedTag}>
            <Text style={styles.occupiedText}>Band</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Interaktiv joy tanlash</Text>
      <Text style={styles.subheading}>Avtomobil sxemasidan o’zingizga ma’qul o’rindiqni tanlang</Text>

      {/* Car Body Container */}
      <View style={styles.carBody}>
        {/* Windshield */}
        <View style={styles.windshield}>
          <Text style={styles.windshieldText}>Old oyna (Oldi tomon)</Text>
        </View>

        {/* Front Row: Steering wheel on Left, Front Passenger (Seat 1) on Right */}
        <View style={styles.row}>
          <View style={[styles.seatBox, styles.driverSeat]}>
            <Disc size={28} color={COLORS.gray[400]} />
            <Text style={styles.driverSeatText}>Haydovchi</Text>
          </View>
          {renderSeat(1, 'Old o’rindiq')}
        </View>

        {/* Aisle */}
        <View style={styles.aisleDivider}>
          <Text style={styles.aisleText}>— Orqa qator —</Text>
        </View>

        {/* Back Row: Seat 2 (Left), Seat 3 (Middle), Seat 4 (Right) */}
        <View style={styles.row}>
          {renderSeat(2, 'Chap')}
          {renderSeat(3, 'O’rta')}
          {renderSeat(4, 'O’ng')}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: COLORS.emerald[100], borderColor: COLORS.emerald[500] }]} />
          <Text style={styles.legendText}>Bo’sh joy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: COLORS.emerald[600], borderColor: COLORS.emerald[700] }]} />
          <Text style={styles.legendText}>Tanlangan</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: COLORS.gray[200], borderColor: COLORS.gray[300] }]} />
          <Text style={styles.legendText}>Band</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  subheading: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
    marginBottom: 12,
  },
  carBody: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  windshield: {
    backgroundColor: COLORS.blue[50],
    borderWidth: 1,
    borderColor: COLORS.blue[100],
    borderRadius: 12,
    paddingVertical: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  windshieldText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.blue[600],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 8,
  },
  aisleDivider: {
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  aisleText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray[400],
    textTransform: 'uppercase',
  },
  seatBox: {
    flex: 1,
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.sm,
  },
  seatTopPillow: {
    position: 'absolute',
    top: 4,
    width: '60%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  driverSeat: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[300],
    opacity: 0.9,
  },
  driverSeatText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[500],
    marginTop: 4,
  },
  seatAvailable: {
    backgroundColor: COLORS.emerald[50],
    borderColor: COLORS.emerald[400],
  },
  seatSelected: {
    backgroundColor: COLORS.emerald[600],
    borderColor: COLORS.emerald[700],
  },
  seatOccupied: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[300],
    opacity: 0.6,
  },
  seatContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  seatNum: {
    fontSize: 14,
    fontWeight: '900',
  },
  seatLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  textAvailable: {
    color: COLORS.emerald[800],
  },
  textSelected: {
    color: COLORS.white,
  },
  textOccupied: {
    color: COLORS.gray[400],
  },
  priceTag: {
    marginTop: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  priceTagSelected: {
    backgroundColor: COLORS.emerald[800],
    borderColor: COLORS.emerald[900],
  },
  priceText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.emerald[700],
  },
  priceTextSelected: {
    color: COLORS.white,
  },
  occupiedTag: {
    marginTop: 4,
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  occupiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[500],
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
});
