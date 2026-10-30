import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Haptics } from './Haptics';

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  // Ensure the bar stays above the home indicator or device bottom edge
  const bottomOffset = Math.max(insets.bottom, 14);

  return (
    <View
      style={[styles.wrapper, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const rawLabel =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const labelText = typeof rawLabel === 'string' ? rawLabel : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.selection();
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? '#FF8800' : '#94A3B8',
            size: 22,
          });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel || labelText}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.75}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive,
              ]}
            >
              <View style={styles.iconContainer}>
                {icon}
                {options.tabBarBadge !== undefined && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {typeof options.tabBarBadge === 'number' && options.tabBarBadge > 99
                        ? '99+'
                        : options.tabBarBadge}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  isFocused ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {labelText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 480,
    height: 68,
    backgroundColor: '#15171E',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#272B35',
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tabItemActive: {
    backgroundColor: '#201A12',
    borderWidth: 1,
    borderColor: '#3D2A14',
  },
  iconContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#15171E',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    lineHeight: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  labelActive: {
    color: '#FF8800',
    fontWeight: '800',
  },
  labelInactive: {
    color: '#94A3B8',
  },
});
