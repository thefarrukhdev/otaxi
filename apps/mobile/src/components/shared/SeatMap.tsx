import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { SeatInfo } from '../../types';
import { Haptics } from '../ui/Haptics';
import { Disc, Check, Lock, Sparkles } from 'lucide-react-native';

export interface SeatMapProps {
  seats: SeatInfo[];
  selectedSeats: number[];
  onToggleSeat: (seatNumber: number) => void;
  basePrice: number;
}

export const SeatMap: React.FC<SeatMapProps> = React.memo(
  ({ seats, selectedSeats, onToggleSeat, basePrice }) => {
    const getSeat = (num: number) => seats.find((s) => s.seatNumber === num);

    const handlePressSeat = (seatNumber: number, isAvailable: boolean) => {
      if (!isAvailable) {
        Haptics.warning();
        return;
      }
      Haptics.selection();
      onToggleSeat(seatNumber);
    };

    const renderSeat = (num: number, label: string, isVip: boolean = false) => {
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
          onPress={() => handlePressSeat(num, isAvailable)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.seatTopPillow,
              isSelected && styles.seatTopPillowSelected,
              !isAvailable && styles.seatTopPillowOccupied,
            ]}
          />

          {isVip && isAvailable && (
            <View style={styles.vipTag}>
              <Sparkles size={9} color={COLORS.amber[600]} />
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}

          <View style={styles.seatContent}>
            {isSelected ? (
              <View style={styles.checkCircle}>
                <Check size={16} color={COLORS.white} />
              </View>
            ) : !isAvailable ? (
              <Lock size={15} color={COLORS.gray[400]} />
            ) : (
              <Text style={styles.seatNum}>#{num}</Text>
            )}

            <Text
              style={[
                styles.seatLabel,
                isSelected
                  ? styles.textSelected
                  : !isAvailable
                  ? styles.textOccupied
                  : styles.textAvailable,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>

          {isAvailable ? (
            <View style={[styles.priceTag, isSelected && styles.priceTagSelected]}>
              <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                {finalPrice.toLocaleString('uz-UZ')} UZS
              </Text>
            </View>
          ) : (
            <View style={styles.occupiedTag}>
              <Text style={styles.occupiedText}>Band</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Interaktiv salon sxemasi</Text>
          <Text style={styles.subheading}>Kerakli o’rindiqni tanlang</Text>
        </View>

        {/* Car Cabin Chassis */}
        <View style={styles.carBody}>
          {/* Front Windshield Indicator */}
          <View style={styles.windshield}>
            <View style={styles.windshieldLine} />
            <Text style={styles.windshieldText}>Old tomon (Harakat yo’nalishi ⇡)</Text>
          </View>

          {/* Front Row: Steering wheel on Left, Seat #1 (VIP) on Right */}
          <View style={styles.row}>
            <View style={[styles.seatBox, styles.driverSeat]}>
              <View style={styles.steeringWheel}>
                <Disc size={26} color={COLORS.gray[400]} />
              </View>
              <Text style={styles.driverSeatText}>Haydovchi</Text>
              <View style={styles.driverBadge}>
                <Text style={styles.driverBadgeText}>Rul</Text>
              </View>
            </View>

            {renderSeat(1, 'Oldi VIP #1', true)}
          </View>

          {/* Console / Aisle gap */}
          <View style={styles.aisleGap}>
            <View style={styles.aisleDivider} />
          </View>

          {/* Rear Row: Seat #2 (Left Window), Seat #3 (Middle), Seat #4 (Right Window) */}
          <View style={styles.rearRow}>
            {renderSeat(2, 'Orqa chap #2')}
            {renderSeat(3, 'Orqa o’rta #3')}
            {renderSeat(4, 'Orqa o’ng #4')}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1A1D26', borderColor: '#2A303F' }]} />
            <Text style={styles.legendText}>Bo’sh joy</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF8800', borderColor: '#FF8800' }]} />
            <Text style={styles.legendText}>Tanlangan</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#15171E', borderColor: '#272B35' }]} />
            <Text style={styles.legendText}>Band qilingan</Text>
          </View>
        </View>
      </View>
    );
  }
);

SeatMap.displayName = 'SeatMap';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#15171E',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#272B35',
    ...SHADOWS.sm,
  },
  headerRow: {
    marginBottom: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subheading: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  carBody: {
    backgroundColor: '#0C0D11',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#272B35',
    padding: 14,
    paddingTop: 10,
  },
  windshield: {
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#272B35',
  },
  windshieldLine: {
    width: 60,
    height: 3,
    backgroundColor: '#272B35',
    borderRadius: 2,
    marginBottom: 4,
  },
  windshieldText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  aisleGap: {
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aisleDivider: {
    width: '90%',
    height: 1,
    backgroundColor: '#1E222A',
  },
  seatBox: {
    flex: 1,
    height: 110,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#1A1D26',
    borderColor: '#2A303F',
  },
  seatTopPillow: {
    width: 26,
    height: 4,
    backgroundColor: '#272B35',
    borderRadius: 2,
  },
  seatTopPillowSelected: {
    backgroundColor: '#0C0D11',
  },
  seatTopPillowOccupied: {
    backgroundColor: '#1E222A',
  },
  vipTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#251B10',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  vipText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FF8800',
  },
  seatAvailable: {
    backgroundColor: '#1A1D26',
    borderColor: '#2A303F',
  },
  seatSelected: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  seatOccupied: {
    backgroundColor: '#12141A',
    borderColor: '#1E222A',
    opacity: 0.6,
  },
  driverSeat: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
    borderStyle: 'dashed',
    justifyContent: 'center',
    gap: 6,
  },
  steeringWheel: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E222A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverSeatText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  driverBadge: {
    backgroundColor: '#1E222A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  driverBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  seatContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0C0D11',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  seatLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  textAvailable: {
    color: '#94A3B8',
  },
  textSelected: {
    color: '#0C0D11',
    fontWeight: '800',
  },
  textOccupied: {
    color: '#475569',
  },
  priceTag: {
    backgroundColor: '#1C2029',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  priceTagSelected: {
    backgroundColor: '#0C0D11',
  },
  priceText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF8800',
    fontVariant: ['tabular-nums'],
  },
  priceTextSelected: {
    color: '#FF8800',
  },
  occupiedTag: {
    backgroundColor: '#1E222A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  occupiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#272B35',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
