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
            <View style={[styles.legendDot, { backgroundColor: COLORS.emerald[50], borderColor: COLORS.emerald[400] }]} />
            <Text style={styles.legendText}>Bo’sh joy</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.emerald[600], borderColor: COLORS.emerald[700] }]} />
            <Text style={styles.legendText}>Tanlangan</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.gray[200], borderColor: COLORS.gray[300] }]} />
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
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  headerRow: {
    marginBottom: 14,
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
  },
  carBody: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    padding: 14,
    paddingTop: 10,
  },
  windshield: {
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.gray[200],
  },
  windshieldLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.gray[300],
    borderRadius: 2,
    marginBottom: 4,
  },
  windshieldText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[400],
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
    backgroundColor: COLORS.gray[200],
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
    backgroundColor: COLORS.white,
  },
  seatTopPillow: {
    width: 26,
    height: 4,
    backgroundColor: COLORS.gray[300],
    borderRadius: 2,
  },
  seatTopPillowSelected: {
    backgroundColor: '#64748B',
  },
  seatTopPillowOccupied: {
    backgroundColor: COLORS.gray[300],
  },
  vipTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.amber[50],
    borderWidth: 1,
    borderColor: COLORS.amber[200],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  vipText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.amber[700],
  },
  seatAvailable: {
    backgroundColor: COLORS.white,
    borderColor: '#CBD5E1',
  },
  seatSelected: {
    backgroundColor: '#090D16',
    borderColor: '#090D16',
  },
  seatOccupied: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[200],
    opacity: 0.65,
  },
  driverSeat: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    gap: 6,
  },
  steeringWheel: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverSeatText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[600],
  },
  driverBadge: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  driverBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[600],
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
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNum: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  seatLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  textAvailable: {
    color: COLORS.gray[700],
  },
  textSelected: {
    color: COLORS.white,
  },
  textOccupied: {
    color: COLORS.gray[400],
  },
  priceTag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
  },
  priceTagSelected: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  priceText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#090D16',
    fontVariant: ['tabular-nums'],
  },
  priceTextSelected: {
    color: COLORS.white,
  },
  occupiedTag: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
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
    color: COLORS.gray[600],
    fontWeight: '600',
  },
});
