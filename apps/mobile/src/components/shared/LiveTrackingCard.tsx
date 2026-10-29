import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, G, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, SHADOWS } from '../../lib/theme';
import { useTheme } from '../../hooks/useTheme';
import { useTracking, CurrentCoords } from '../../hooks/useTracking';
import { Haptics } from '../ui/Haptics';
import {
  Radio,
  Navigation,
  MapPin,
  Clock,
  Compass,
  ShieldAlert,
  Globe,
  Gauge,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

export interface LiveTrackingCardProps {
  /** Safar identifikatori (berilsa, hook orqali avtomatik ulanadi) */
  tripId?: string;
  /** Reys xalqaro koridor ekanligi (masalan: O'zbekiston - Qozog'iston) */
  isInternational?: boolean;
  /** Koridor yo'nalishi ('TASHKENT_SHYMKENT' yoki 'TASHKENT_SAMARKAND') */
  routeType?: 'TASHKENT_SHYMKENT' | 'TASHKENT_SAMARKAND';
  /** Jo'nash shahri */
  originCity?: string;
  /** Manzil shahri */
  destinationCity?: string;
  /** Tashqi o'rnatilgan tezlik (km/soat) */
  speedKmH?: number;
  /** Tashqi o'rnatilgan qolgan masofa (km) */
  remainingDistanceKm?: number;
  /** Tashqi o'rnatilgan qolgan vaqt (daqiqalarda) */
  remainingDurationMin?: number;
  /** Tashqi o'rnatilgan chegara masofasi (km) */
  borderDistanceKm?: number;
  /** Tashqi o'rnatilgan soket ulanish holati */
  isConnected?: boolean;
  /** Tashqi o'rnatilgan joriy koordinatalar */
  currentCoords?: CurrentCoords;
  /** Karta bosilgandagi harakat */
  onPressDetails?: () => void;
  /** Maxsus konteyner uslubi */
  style?: StyleProp<ViewStyle>;
  /** Ixcham rejim */
  compact?: boolean;
}

export const LiveTrackingCard: React.FC<LiveTrackingCardProps> = React.memo(
  ({
    tripId,
    isInternational = true,
    routeType = 'TASHKENT_SHYMKENT',
    originCity = 'Toshkent',
    destinationCity = 'Chimkent',
    speedKmH: propSpeed,
    remainingDistanceKm: propRemDist,
    remainingDurationMin: propRemDur,
    borderDistanceKm: propBorderDist,
    isConnected: propIsConnected,
    currentCoords: propCoords,
    onPressDetails,
    style,
    compact = false,
  }) => {
    const { isDriver } = useTheme();

    // Agar ma'lumotlar tashqi proplarda berilmagan bo'lsa, ichki useTracking hookini ishga tushiramiz
    const tracking = useTracking({
      tripId: tripId || 'live_trip_active',
      autoStart: true,
      isInternational,
      routeType,
    });

    // Proplar va hook qiymatlarini birlashtirish
    const liveSpeed = propSpeed !== undefined ? propSpeed : tracking.speedKmH;
    const remainingDist =
      propRemDist !== undefined ? propRemDist : tracking.remainingDistanceKm;
    const remainingMin =
      propRemDur !== undefined ? propRemDur : tracking.remainingDurationMin;
    const borderDist =
      propBorderDist !== undefined ? propBorderDist : tracking.borderDistanceKm;
    const isSocketConnected =
      propIsConnected !== undefined ? propIsConnected : tracking.isConnected;
    const coords = propCoords || tracking.currentCoords;

    // Chegara zonasida ekanligini tekshirish (< 15 km)
    const isNearBorder =
      isInternational && borderDist !== undefined && borderDist > 0 && borderDist < 15;

    // ========================================================================
    // PULSING GPS ANIMATION (Yashil puls indikatori)
    // ========================================================================
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseOpacity = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
      const pulseLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.8,
              duration: 1200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 1200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      pulseLoop.start();

      return () => {
        pulseLoop.stop();
      };
    }, [pulseAnim, pulseOpacity]);

    // Formatlangan qolgan vaqt matni
    const formattedDuration = useMemo(() => {
      if (remainingMin < 60) {
        return `${remainingMin} daq`;
      }
      const hours = Math.floor(remainingMin / 60);
      const mins = remainingMin % 60;
      return `${hours} soat ${mins > 0 ? `${mins} daq` : ''}`.trim();
    }, [remainingMin]);

    // Kompas yo'nalishi matni
    const headingText = useMemo(() => {
      const h = coords.heading;
      if (h >= 337.5 || h < 22.5) return 'Shimol';
      if (h >= 22.5 && h < 67.5) return 'Shimoli-Sharq';
      if (h >= 67.5 && h < 112.5) return 'Sharq';
      if (h >= 112.5 && h < 157.5) return 'Janubi-Sharq';
      if (h >= 157.5 && h < 202.5) return 'Janub';
      if (h >= 202.5 && h < 247.5) return 'Janubi-G\'arb';
      if (h >= 247.5 && h < 292.5) return 'G\'arb';
      return 'Shimoli-G\'arb';
    }, [coords.heading]);

    // Spidometr doira parametri (0 - 140 km/soat shkalasi)
    const gaugeRadius = 40;
    const gaugeStrokeWidth = 7;
    const gaugeCircumference = 2 * Math.PI * gaugeRadius;
    const speedPercent = Math.min(100, Math.max(0, (liveSpeed / 140) * 100));
    // 240 graduslik arc uchun
    const arcLength = (gaugeCircumference * 240) / 360;
    const strokeDashoffset = arcLength - (arcLength * speedPercent) / 100;

    return (
      <View
        style={[
          styles.container,
          isDriver ? styles.containerDark : styles.containerLight,
          style,
        ]}
      >
        {/* ================================================================= */}
        {/* HEADER: GPS Signal Indikatori va Tranzit Ma'lumoti */}
        {/* ================================================================= */}
        <View style={styles.headerRow}>
          <View style={styles.gpsIndicatorGroup}>
            {/* Pulsing Dot */}
            <View style={styles.pulseContainer}>
              <Animated.View
                style={[
                  styles.pulseCircle,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseOpacity,
                    backgroundColor: isSocketConnected
                      ? COLORS.emerald[400]
                      : COLORS.amber[400],
                  },
                ]}
              />
              <View
                style={[
                  styles.gpsStaticDot,
                  {
                    backgroundColor: isSocketConnected
                      ? COLORS.emerald[500]
                      : COLORS.amber[500],
                  },
                ]}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.gpsStatusText,
                  isDriver ? styles.textLight : styles.textDark,
                ]}
              >
                {isSocketConnected ? 'GPS JONLI ULONISH' : 'GPS TELEMETRIYA'}
              </Text>
              <Text style={styles.gpsSubText}>
                {isSocketConnected
                  ? 'Tracking Gateway (/tracking)'
                  : 'Silliq oflayn simulyatsiya'}
              </Text>
            </View>
          </View>

          {/* Koridor Teg */}
          <View
            style={[
              styles.corridorTag,
              isDriver ? styles.corridorTagDark : styles.corridorTagLight,
            ]}
          >
            {isInternational ? (
              <Globe
                size={11}
                color={isDriver ? COLORS.amber[400] : COLORS.emerald[600]}
              />
            ) : (
              <Navigation
                size={11}
                color={isDriver ? COLORS.amber[400] : COLORS.emerald[600]}
              />
            )}
            <Text
              style={[
                styles.corridorTagText,
                isDriver ? styles.corridorTextDark : styles.corridorTextLight,
              ]}
            >
              {originCity} ➔ {destinationCity}
            </Text>
          </View>
        </View>

        {/* ================================================================= */}
        {/* TELEMETRIYA ASOSIY BLOKI: Spidometr va Masofa/Vaqt */}
        {/* ================================================================= */}
        <View style={styles.telemetryContentRow}>
          {/* Spidometr Doirasi */}
          <View style={styles.speedometerWrapper}>
            <Svg width={96} height={96} viewBox="0 0 96 96">
              <Defs>
                <LinearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop
                    offset="0%"
                    stopColor={isDriver ? COLORS.amber[400] : COLORS.emerald[500]}
                  />
                  <Stop
                    offset="100%"
                    stopColor={isDriver ? '#f97316' : '#059669'}
                  />
                </LinearGradient>
              </Defs>
              {/* Orqa fon aylanasi (track) */}
              <Circle
                cx="48"
                cy="48"
                r={gaugeRadius}
                stroke={isDriver ? COLORS.navy[800] : COLORS.gray[200]}
                strokeWidth={gaugeStrokeWidth}
                fill="none"
                strokeDasharray={`${arcLength} ${gaugeCircumference}`}
                strokeLinecap="round"
                transform="rotate(150 48 48)"
              />
              {/* Dinamik progress aylanasi */}
              <Circle
                cx="48"
                cy="48"
                r={gaugeRadius}
                stroke="url(#speedGradient)"
                strokeWidth={gaugeStrokeWidth}
                fill="none"
                strokeDasharray={`${arcLength} ${gaugeCircumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(150 48 48)"
              />
            </Svg>

            {/* Doira markazidagi jonli tezlik ko'rsatkichi */}
            <View style={styles.speedTextCenter}>
              <Text
                style={[
                  styles.speedValueText,
                  isDriver ? styles.speedValueDark : styles.speedValueLight,
                ]}
              >
                {liveSpeed}
              </Text>
              <Text style={styles.speedUnitText}>km/s</Text>
            </View>
          </View>

          {/* O'ng tomondagi Telemetriya ko'rsatkichlari */}
          <View style={styles.metricsColumn}>
            {/* Qolgan Masofa */}
            <View
              style={[
                styles.metricTile,
                isDriver ? styles.metricTileDark : styles.metricTileLight,
              ]}
            >
              <View style={styles.metricIconBox}>
                <MapPin
                  size={14}
                  color={isDriver ? COLORS.amber[400] : COLORS.emerald[600]}
                />
              </View>
              <View style={styles.metricTextBox}>
                <Text style={styles.metricLabelText}>QOLGAN MASOFA</Text>
                <Text
                  style={[
                    styles.metricValueText,
                    isDriver ? styles.textLight : styles.textDark,
                  ]}
                >
                  {remainingDist.toFixed(1)}{' '}
                  <Text style={styles.metricUnitSmall}>km</Text>
                </Text>
              </View>
            </View>

            {/* Qolgan Vaqt */}
            <View
              style={[
                styles.metricTile,
                isDriver ? styles.metricTileDark : styles.metricTileLight,
              ]}
            >
              <View style={styles.metricIconBox}>
                <Clock
                  size={14}
                  color={isDriver ? COLORS.blue[400] : COLORS.blue[600]}
                />
              </View>
              <View style={styles.metricTextBox}>
                <Text style={styles.metricLabelText}>QOLGAN VAQT (ETA)</Text>
                <Text
                  style={[
                    styles.metricValueText,
                    isDriver ? styles.textLight : styles.textDark,
                  ]}
                >
                  {formattedDuration}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================================================================= */}
        {/* AZIMUT VA TRASSA STATUSI ROW */}
        {/* ================================================================= */}
        <View
          style={[
            styles.azimuthRow,
            isDriver ? styles.azimuthRowDark : styles.azimuthRowLight,
          ]}
        >
          <View style={styles.azimuthItem}>
            <Compass
              size={13}
              color={isDriver ? COLORS.navy[400] : COLORS.gray[500]}
            />
            <Text style={styles.azimuthText}>
              Azimut: {coords.heading}° ({headingText})
            </Text>
          </View>

          <View style={styles.azimuthItem}>
            <Gauge
              size={13}
              color={isDriver ? COLORS.navy[400] : COLORS.gray[500]}
            />
            <Text style={styles.azimuthText}>Maks: 110 km/s</Text>
          </View>

          {isInternational && borderDist !== undefined && (
            <View style={styles.azimuthItem}>
              <ShieldCheck
                size={13}
                color={
                  isNearBorder
                    ? COLORS.red[400]
                    : isDriver
                    ? COLORS.amber[400]
                    : COLORS.emerald[600]
                }
              />
              <Text
                style={[
                  styles.azimuthText,
                  isNearBorder && styles.azimuthBorderAlertText,
                ]}
              >
                Chegara: {borderDist.toFixed(1)} km
              </Text>
            </View>
          )}
        </View>

        {/* ================================================================= */}
        {/* CHEGARA OGOHLANTIRUVCHI BILDIRISHNOMA (< 15 KM BO'LGANDA) */}
        {/* ================================================================= */}
        {isNearBorder && (
          <View style={styles.borderAlertCard}>
            <View style={styles.borderAlertHeaderRow}>
              <View style={styles.borderAlertIconBox}>
                <ShieldAlert size={18} color="#dc2626" />
              </View>
              <View style={styles.borderAlertTextWrapper}>
                <Text style={styles.borderAlertTitle}>
                  CHEGARA POSTIGA YAQINLASHMOQDA ({borderDist?.toFixed(1)} KM)
                </Text>
                <Text style={styles.borderAlertBody}>
                  Chegara zonasiga yaqinlashmoqdasiz! Pasport va deklaratsiyani
                  tayyorlang.
                </Text>
              </View>
            </View>

            <View style={styles.borderAlertFooter}>
              <AlertTriangle size={12} color="#b91c1c" />
              <Text style={styles.borderAlertTip}>
                Bojxona tekshiruvi uchun pasport va chek-list hujjatlarini qo’l
                yukingizda saqlang.
              </Text>
            </View>
          </View>
        )}

        {/* Tafsilotlarni ko'rish tugmasi (ixtiyoriy) */}
        {onPressDetails && (
          <TouchableOpacity
            style={[
              styles.detailsBtn,
              isDriver ? styles.detailsBtnDark : styles.detailsBtnLight,
            ]}
            onPress={() => {
              Haptics.light();
              onPressDetails();
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.detailsBtnText,
                isDriver ? styles.detailsTextDark : styles.detailsTextLight,
              ]}
            >
              Jonli xarita va marshrut tafsilotlari
            </Text>
            <ChevronRight
              size={14}
              color={isDriver ? COLORS.amber[400] : COLORS.emerald[600]}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    ...SHADOWS.md,
  },
  containerDark: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
  },
  containerLight: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gpsIndicatorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pulseContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  gpsStaticDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  gpsStatusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gpsSubText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },

  corridorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  corridorTagDark: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderWidth: 0,
  },
  corridorTagLight: {
    backgroundColor: 'rgba(255, 136, 0, 0.08)',
    borderWidth: 0,
  },
  corridorTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  corridorTextDark: {
    color: '#FF8800',
  },
  corridorTextLight: {
    color: COLORS.emerald[700],
  },

  // Telemetriya asosiy qismi
  telemetryContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  speedometerWrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedTextCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedValueText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  speedValueDark: {
    color: '#ffffff',
  },
  speedValueLight: {
    color: '#ffffff',
  },
  speedUnitText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: -3,
    textTransform: 'uppercase',
  },

  metricsColumn: {
    flex: 1,
    marginLeft: 14,
    gap: 8,
  },
  metricTile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricTileDark: {
    backgroundColor: '#1D2029',
    borderColor: '#272B35',
  },
  metricTileLight: {
    backgroundColor: '#1D2029',
    borderColor: '#272B35',
  },
  metricIconBox: {
    marginRight: 10,
  },
  metricTextBox: {
    flex: 1,
  },
  metricLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  metricValueText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 1,
  },
  metricUnitSmall: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
  },

  // Azimut va pastki metadata
  azimuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  azimuthRowDark: {
    borderTopColor: '#1f2937',
  },
  azimuthRowLight: {
    borderTopColor: '#f1f5f9',
  },
  azimuthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  azimuthText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  azimuthBorderAlertText: {
    color: '#ef4444',
    fontWeight: '700',
  },

  // Chegara ogohlantiruvchi kartasi
  borderAlertCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fef2f2', // Qizil/amber ogohlantirish
    borderWidth: 1.5,
    borderColor: '#fca5a5',
  },
  borderAlertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  borderAlertIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  borderAlertTextWrapper: {
    flex: 1,
  },
  borderAlertTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991b1b',
    letterSpacing: 0.4,
  },
  borderAlertBody: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f1d1d',
    marginTop: 2,
    lineHeight: 16,
  },
  borderAlertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  borderAlertTip: {
    fontSize: 10,
    color: '#b91c1c',
    flex: 1,
    fontWeight: '500',
  },

  // Tafsilotlar tugmasi
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  detailsBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  detailsBtnLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  detailsBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailsTextDark: {
    color: COLORS.amber[400],
  },
  detailsTextLight: {
    color: COLORS.emerald[700],
  },

  textLight: {
    color: '#f8fafc',
  },
  textDark: {
    color: '#0f172a',
  },
});
