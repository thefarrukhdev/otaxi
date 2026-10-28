import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Haptics } from '../ui/Haptics';
import { Sparkles, ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react-native';

export interface RouteOption {
  from: string;
  to: string;
  isInternational: boolean;
  price: string;
  time: string;
  borderName?: string;
  countryCode?: string;
}

export const CORRIDOR_ROUTES: RouteOption[] = [
  {
    from: 'Toshkent',
    to: 'Samarqand',
    isInternational: false,
    price: '85 000 UZS',
    time: '3.5 soat',
    countryCode: 'UZ',
  },
  {
    from: 'Toshkent',
    to: 'Shymkent',
    isInternational: true,
    price: '120 000 UZS',
    time: '3 soat',
    borderName: "G'ishtko'prik",
    countryCode: 'KZ',
  },
  {
    from: 'Toshkent',
    to: 'Bishkek',
    isInternational: true,
    price: '260 000 UZS',
    time: '9 soat',
    borderName: 'Qorday / Chaldovar',
    countryCode: 'KG',
  },
  {
    from: 'Toshkent',
    to: 'Buxoro',
    isInternational: false,
    price: '130 000 UZS',
    time: '6 soat',
    countryCode: 'UZ',
  },
  {
    from: 'Toshkent',
    to: "Xo'jand",
    isInternational: true,
    price: '100 000 UZS',
    time: '3.5 soat',
    borderName: 'Oybek',
    countryCode: 'TJ',
  },
  {
    from: 'Samarqand',
    to: 'Buxoro',
    isInternational: false,
    price: '70 000 UZS',
    time: '3.5 soat',
    countryCode: 'UZ',
  },
];

export interface CorridorQuickSelectProps {
  onSelectRoute: (route: RouteOption) => void;
  selectedTo?: string;
  selectedFrom?: string;
}

export const CorridorQuickSelect: React.FC<CorridorQuickSelectProps> = React.memo(
  ({ onSelectRoute, selectedTo, selectedFrom }) => {
    const handleSelect = (route: RouteOption) => {
      Haptics.selection();
      onSelectRoute(route);
    };

    const getFlag = (to: string, countryCode?: string) => {
      if (countryCode === 'KZ' || to === 'Shymkent') return '🇰🇿';
      if (countryCode === 'KG' || to === 'Bishkek') return '🇰🇬';
      if (countryCode === 'TJ' || to === "Xo'jand" || to === 'Xo’jand') return '🇹🇯';
      return '🇺🇿';
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.titleWithIcon}>
            <Sparkles size={16} color={COLORS.emerald[600]} />
            <Text style={styles.title}>Mashhur magistral koridorlar</Text>
          </View>
          <Text style={styles.hint}>Bir tegishda qidirish</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
        >
          {CORRIDOR_ROUTES.map((route, index) => {
            const isSelected =
              selectedTo === route.to && (!selectedFrom || selectedFrom === route.from);
            const flag = getFlag(route.to, route.countryCode);

            return (
              <TouchableOpacity
                key={`${route.from}-${route.to}-${index}`}
                style={[
                  styles.routeCard,
                  isSelected && styles.routeCardSelected,
                  route.isInternational && styles.routeCardInternational,
                ]}
                onPress={() => handleSelect(route)}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={`${route.from} dan ${route.to} ga koridori`}
              >
                {/* Top Badge Row */}
                <View style={styles.cardTopRow}>
                  <Text style={styles.flagBadge}>{flag}</Text>
                  {route.isInternational ? (
                    <View style={styles.intlPill}>
                      <Text style={styles.intlPillText}>Xalqaro</Text>
                    </View>
                  ) : (
                    <View style={styles.domesticPill}>
                      <Text style={styles.domesticPillText}>Shaharlararo</Text>
                    </View>
                  )}
                </View>

                {/* Cities Row */}
                <View style={styles.routeCityRow}>
                  <Text style={styles.fromText}>{route.from}</Text>
                  <View style={styles.arrowIconContainer}>
                    <ArrowRight size={13} color={COLORS.gray[400]} />
                  </View>
                  <Text style={styles.toText}>
                    {route.to} {route.isInternational ? flag : ''}
                  </Text>
                </View>

                {/* Border or Highway info */}
                {route.borderName ? (
                  <View style={styles.borderNoteRow}>
                    <MapPin size={10} color={COLORS.blue[600]} />
                    <Text style={styles.borderNoteText} numberOfLines={1}>
                      Chegara: {route.borderName}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.borderNoteRow}>
                    <ShieldCheck size={10} color={COLORS.emerald[600]} />
                    <Text style={styles.domesticNoteText} numberOfLines={1}>
                      M39 trassa orqali
                    </Text>
                  </View>
                )}

                {/* Card Footer: Price & Time */}
                <View style={styles.cardFooter}>
                  <Text style={styles.priceText}>
                    {route.price}{' '}
                    <Text style={styles.priceSubtext}>dan</Text>
                  </Text>
                  <View style={styles.timeRow}>
                    <Clock size={11} color={COLORS.gray[400]} />
                    <Text style={styles.timeText}>{route.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

CorridorQuickSelect.displayName = 'CorridorQuickSelect';

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gray[900],
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 11,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  routeCard: {
    width: 185,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    padding: 12,
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  routeCardSelected: {
    borderColor: COLORS.emerald[600],
    backgroundColor: COLORS.emerald[50],
  },
  routeCardInternational: {
    borderColor: '#DDD6FE',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagBadge: {
    fontSize: 18,
  },
  intlPill: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  intlPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6D28D9',
    textTransform: 'uppercase',
  },
  domesticPill: {
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.emerald[200],
  },
  domesticPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.emerald[700],
    textTransform: 'uppercase',
  },
  routeCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  fromText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  arrowIconContainer: {
    paddingHorizontal: 1,
  },
  toText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gray[900],
    flexShrink: 1,
  },
  borderNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  borderNoteText: {
    fontSize: 10,
    color: COLORS.blue[600],
    fontWeight: '600',
  },
  domesticNoteText: {
    fontSize: 10,
    color: COLORS.emerald[700],
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  priceText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.emerald[700],
    fontVariant: ['tabular-nums'],
  },
  priceSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.gray[400],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
});
