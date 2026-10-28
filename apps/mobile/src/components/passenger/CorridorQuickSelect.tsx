import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Haptics } from '../ui/Haptics';
import { ArrowRight } from 'lucide-react-native';

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
    time: '3.5s',
    countryCode: 'UZ',
  },
  {
    from: 'Toshkent',
    to: 'Shymkent',
    isInternational: true,
    price: '120 000 UZS',
    time: '3s',
    borderName: "G'ishtko'prik",
    countryCode: 'KZ',
  },
  {
    from: 'Toshkent',
    to: 'Bishkek',
    isInternational: true,
    price: '260 000 UZS',
    time: '9s',
    borderName: 'Qorday',
    countryCode: 'KG',
  },
  {
    from: 'Toshkent',
    to: 'Buxoro',
    isInternational: false,
    price: '130 000 UZS',
    time: '6s',
    countryCode: 'UZ',
  },
  {
    from: 'Toshkent',
    to: "Xo'jand",
    isInternational: true,
    price: '100 000 UZS',
    time: '3.5s',
    borderName: 'Oybek',
    countryCode: 'TJ',
  },
  {
    from: 'Samarqand',
    to: 'Buxoro',
    isInternational: false,
    price: '70 000 UZS',
    time: '3.5s',
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
      if (countryCode === 'KZ' || to === 'Shymkent') return ' 🇰🇿';
      if (countryCode === 'KG' || to === 'Bishkek') return ' 🇰🇬';
      if (countryCode === 'TJ' || to === "Xo'jand" || to === 'Xo’jand') return ' 🇹🇯';
      return '';
    };

    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Mashhur yo'nalishlar</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {CORRIDOR_ROUTES.map((route, index) => {
            const isSelected =
              selectedTo === route.to && (!selectedFrom || selectedFrom === route.from);
            const flag = getFlag(route.to, route.countryCode);

            return (
              <TouchableOpacity
                key={`${route.from}-${route.to}-${index}`}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                ]}
                onPress={() => handleSelect(route)}
                activeOpacity={0.75}
              >
                <Text style={[styles.routeText, isSelected && styles.routeTextSelected]}>
                  {route.from} → {route.to}
                  {flag}
                </Text>
                <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                  {route.price.split(' ')[0]}k
                </Text>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  routeTextSelected: {
    color: '#FFFFFF',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  priceTextSelected: {
    color: '#34D399',
  },
});
