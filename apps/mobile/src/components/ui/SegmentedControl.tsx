import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../lib/theme';
import { useTheme } from '../../hooks/useTheme';
import { Haptics } from './Haptics';

export interface SegmentItem<T = string> {
  id: T;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T = string> {
  items: SegmentItem<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}

export const SegmentedControl = React.memo(
  <T extends string = string>({
    items,
    selectedId,
    onSelect,
    style,
    size = 'md',
  }: SegmentedControlProps<T>) => {
    const { isDriver } = useTheme();

    const handleSelect = (id: T) => {
      if (id !== selectedId) {
        Haptics.selection();
        onSelect(id);
      }
    };

    const isSmall = size === 'sm';

    return (
      <View
        style={[
          styles.container,
          isDriver ? styles.containerDriver : styles.containerPassenger,
          isSmall && styles.containerSmall,
          style,
        ]}
      >
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleSelect(item.id)}
              style={[
                styles.item,
                isSmall && styles.itemSmall,
                isSelected && (isDriver ? styles.itemSelectedDriver : styles.itemSelectedPassenger),
              ]}
            >
              {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
              <Text
                style={[
                  styles.label,
                  isSmall && styles.labelSmall,
                  isDriver ? styles.labelDriver : styles.labelPassenger,
                  isSelected &&
                    (isDriver ? styles.labelSelectedDriver : styles.labelSelectedPassenger),
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {item.badge !== undefined && (
                <View
                  style={[
                    styles.badge,
                    isSelected
                      ? isDriver
                        ? styles.badgeSelectedDriver
                        : styles.badgeSelectedPassenger
                      : isDriver
                      ? styles.badgeUnselectedDriver
                      : styles.badgeUnselectedPassenger,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isSelected
                        ? isDriver
                          ? styles.badgeTextSelectedDriver
                          : styles.badgeTextSelectedPassenger
                        : isDriver
                        ? styles.badgeTextDriver
                        : styles.badgeTextPassenger,
                    ]}
                  >
                    {item.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
) as <T extends string = string>(props: SegmentedControlProps<T>) => React.ReactElement;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
  },
  containerSmall: {
    padding: 2,
    borderRadius: 10,
  },
  containerPassenger: {
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  containerDriver: {
    backgroundColor: COLORS.navy[900],
    borderWidth: 1,
    borderColor: COLORS.navy[800],
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9,
    gap: 6,
  },
  itemSmall: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  itemSelectedPassenger: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  itemSelectedDriver: {
    backgroundColor: COLORS.amber[500],
    shadowColor: COLORS.amber[500],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIcon: {
    marginRight: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 12,
  },
  labelPassenger: {
    color: COLORS.gray[600],
  },
  labelDriver: {
    color: COLORS.navy[300],
  },
  labelSelectedPassenger: {
    color: COLORS.emerald[800],
    fontWeight: '700',
  },
  labelSelectedDriver: {
    color: COLORS.navy[950],
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 2,
  },
  badgeSelectedPassenger: {
    backgroundColor: COLORS.emerald[100],
  },
  badgeSelectedDriver: {
    backgroundColor: COLORS.navy[900],
  },
  badgeUnselectedPassenger: {
    backgroundColor: COLORS.gray[200],
  },
  badgeUnselectedDriver: {
    backgroundColor: COLORS.navy[800],
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextSelectedPassenger: {
    color: COLORS.emerald[800],
  },
  badgeTextSelectedDriver: {
    color: COLORS.amber[400],
  },
  badgeTextPassenger: {
    color: COLORS.gray[600],
  },
  badgeTextDriver: {
    color: COLORS.navy[300],
  },
});
