import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Haptics } from './Haptics';

export interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  testID?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BottomSheetModal: React.FC<BottomSheetModalProps> = React.memo(
  ({
    visible,
    onClose,
    title,
    subtitle,
    children,
    showCloseButton = true,
    testID,
  }) => {
    const insets = useSafeAreaInsets();
    const [isMounted, setIsMounted] = useState(visible);
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (visible) {
        setIsMounted(true);
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            damping: 25,
            mass: 0.9,
            stiffness: 240,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (isMounted) {
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsMounted(false);
        });
      }
    }, [visible, isMounted, translateY, backdropOpacity]);

    const handleClose = () => {
      Haptics.light();
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsMounted(false);
        onClose();
      });
    };

    if (!isMounted && !visible) {
      return null;
    }

    return (
      <Modal
        testID={testID}
        visible={isMounted}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View
              style={[
                styles.backdrop,
                {
                  opacity: backdropOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.65],
                  }),
                },
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Sheet */}
          <Animated.View
            style={[
              styles.sheetContainer,
              {
                paddingBottom: Math.max(insets.bottom, 16) + 8,
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Drag Handle Bar */}
            <View style={styles.handleContainer}>
              <View style={styles.dragHandle} />
            </View>

            {/* Header if title or close button */}
            {(title || showCloseButton) && (
              <View style={styles.headerRow}>
                <View style={styles.titleCol}>
                  {title && <Text style={styles.titleText}>{title}</Text>}
                  {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
                </View>

                {showCloseButton && (
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeBtn}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Yopish"
                  >
                    <X size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content Slot */}
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

BottomSheetModal.displayName = 'BottomSheetModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheetContainer: {
    backgroundColor: '#15171E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#272B35',
    maxHeight: SCREEN_HEIGHT * 0.88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#383E4D',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E212B',
  },
  titleCol: {
    flex: 1,
    paddingRight: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D2029',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
});
