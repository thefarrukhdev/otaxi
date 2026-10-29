import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
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

function SegmentedControlInner<T extends string = string>({
  items,
  selectedId,
  onSelect,
  style,
  size = 'md',
}: SegmentedControlProps<T>): React.ReactElement {
  const handleSelect = (id: T) => {
    if (id !== selectedId) {
      Haptics.selection();
      onSelect(id);
    }
  };

  const isSmall = size === 'sm';

  return (
    <View
      style={[styles.container, isSmall && styles.containerSmall, style]}
      accessibilityRole="tablist"
    >
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => handleSelect(item.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={item.label}
            style={[
              styles.item,
              isSmall && styles.itemSmall,
              isSelected && styles.itemSelected,
            ]}
          >
            {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
            <Text
              style={[
                styles.label,
                isSmall && styles.labelSmall,
                isSelected && styles.labelSelected,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            {item.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  isSelected ? styles.badgeSelected : styles.badgeUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected ? styles.badgeTextSelected : styles.badgeTextUnselected,
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

export const SegmentedControl = React.memo(
  SegmentedControlInner
) as <T extends string = string>(props: SegmentedControlProps<T>) => React.ReactElement;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  containerSmall: {
    padding: 2,
    borderRadius: 10,
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
  itemSelected: {
    backgroundColor: '#FF8800',
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIcon: {
    marginRight: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  labelSmall: {
    fontSize: 12,
  },
  labelSelected: {
    color: '#0C0D11',
    fontWeight: '900',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 2,
  },
  badgeSelected: {
    backgroundColor: '#0C0D11',
  },
  badgeUnselected: {
    backgroundColor: '#272B35',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  badgeTextSelected: {
    color: '#FF8800',
  },
  badgeTextUnselected: {
    color: '#94A3B8',
  },
});
