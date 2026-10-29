import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Haptics } from '../ui/Haptics';
import { Badge } from '../ui/Badge';
import {
  Car,
  Navigation,
  ShieldCheck,
  Clock,
  MapPin,
  Globe,
  Radio,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react-native';

export interface RouteMapProps {
  originCity: string;
  destinationCity: string;
  isInternational?: boolean;
  borderName?: string;
  borderWaitMinutes?: number;
  progressPercent?: number; // 0 to 100
  themeMode?: 'light' | 'dark';
  highwayCode?: string;
  distanceKm?: number;
  estimatedDurationMinutes?: number;
  currentSpeedKmH?: number;
  statusNote?: string;
  onPressBorder?: () => void;
  onPressRoute?: () => void;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

interface CorridorMetadata {
  highwayCode: string;
  isInternational: boolean;
  borderName: string;
  defaultWaitMinutes: number;
  distanceKm: number;
  durationMinutes: number;
  statusDescription: string;
}

/**
 * Intelligent helper to resolve highway codes, border names, and distances
 * across Central Asian / Uzbek transportation corridors.
 */
function resolveCorridorMetadata(
  origin: string,
  destination: string,
  overrideInternational?: boolean
): CorridorMetadata {
  const normOrigin = (origin || '').trim().toLowerCase();
  const normDest = (destination || '').trim().toLowerCase();
  const isDirect = (a: string, b: string) =>
    (normOrigin.includes(a) && normDest.includes(b)) ||
    (normOrigin.includes(b) && normDest.includes(a));

  // Tashkent <-> Shymkent / Chimkent / Turkestan
  if (isDirect('toshkent', 'shymkent') || isDirect('toshkent', 'chimkent') || isDirect('toshkent', 'turk')) {
    return {
      highwayCode: 'M39 / A2',
      isInternational: true,
      borderName: "G'isht-Ko'prik / Chernyayevka",
      defaultWaitMinutes: 25,
      distanceKm: 135,
      durationMinutes: 180,
      statusDescription: "Xalqaro tranzit koridori (O'zbekiston - Qozog'iston)",
    };
  }

  // Tashkent <-> Khujand / Dushanbe
  if (isDirect('toshkent', 'xo’jand') || isDirect('toshkent', "xo'jand") || isDirect('toshkent', 'khujand') || isDirect('toshkent', 'dushanbe')) {
    return {
      highwayCode: 'M34',
      isInternational: true,
      borderName: 'Oybek / Fotehobod',
      defaultWaitMinutes: 20,
      distanceKm: 165,
      durationMinutes: 210,
      statusDescription: "Xalqaro magistral koridori (O'zbekiston - Tojikiston)",
    };
  }

  // Tashkent <-> Bishkek
  if (isDirect('toshkent', 'bishkek')) {
    return {
      highwayCode: 'M39 / A2 / E40',
      isInternational: true,
      borderName: "Qo'rdoy / Oq-jo'l",
      defaultWaitMinutes: 35,
      distanceKm: 570,
      durationMinutes: 540,
      statusDescription: "Xalqaro magistral (Qozog'iston tranziti orqali)",
    };
  }

  // Tashkent <-> Samarkand
  if (isDirect('toshkent', 'samarqand')) {
    return {
      highwayCode: 'M39',
      isInternational: false,
      borderName: '',
      defaultWaitMinutes: 0,
      distanceKm: 310,
      durationMinutes: 240,
      statusDescription: "Katta O'zbek Trakti (Toshkent - Jizzax - Samarqand)",
    };
  }

  // Samarkand <-> Bukhara
  if (isDirect('samarqand', 'buxoro')) {
    return {
      highwayCode: 'M37',
      isInternational: false,
      borderName: '',
      defaultWaitMinutes: 0,
      distanceKm: 270,
      durationMinutes: 210,
      statusDescription: "M37 Buyuk Ipak Yo'li magistrali",
    };
  }

  // Tashkent <-> Bukhara
  if (isDirect('toshkent', 'buxoro')) {
    return {
      highwayCode: 'M39 / M37',
      isInternational: false,
      borderName: '',
      defaultWaitMinutes: 0,
      distanceKm: 580,
      durationMinutes: 390,
      statusDescription: "M39 va M37 Respublika magistrallari",
    };
  }

  // Tashkent <-> Fergana valley (Andijon, Namangan, Farg'ona)
  if (
    isDirect('toshkent', 'farg’ona') ||
    isDirect('toshkent', "farg'ona") ||
    isDirect('toshkent', 'andijon') ||
    isDirect('toshkent', 'namangan')
  ) {
    return {
      highwayCode: 'A373',
      isInternational: false,
      borderName: '',
      defaultWaitMinutes: 0,
      distanceKm: 330,
      durationMinutes: 270,
      statusDescription: "A373 Kamchiq tog' dovoni orqali",
    };
  }

  // Default fallback
  const isIntl = overrideInternational !== undefined ? overrideInternational : false;
  return {
    highwayCode: isIntl ? 'M39 Xalqaro' : 'M39 Magistral',
    isInternational: isIntl,
    borderName: isIntl ? 'Davlat Chegara Posti' : '',
    defaultWaitMinutes: isIntl ? 25 : 0,
    distanceKm: 220,
    durationMinutes: 180,
    statusDescription: isIntl ? 'Xalqaro chegara yo\'nalishi' : 'Shaharlararo qatnov magistrali',
  };
}

/**
 * Mathematical evaluator for smooth cubic bezier road corridor.
 * Returns exact coordinates (x, y) and tangent angle in degrees.
 */
function getBezierPoint(progressPercent: number): { x: number; y: number; angleDeg: number } {
  const t = Math.max(0, Math.min(100, progressPercent)) / 100;

  // Segment 1: from P0(45,68) to Pmid(180,68)
  // Segment 2: from Pmid(180,68) to P5(315,68)
  let x: number, y: number, dx: number, dy: number;

  if (t <= 0.5) {
    const u = t / 0.5;
    const u2 = u * u;
    const u3 = u2 * u;
    const m = 1 - u;
    const m2 = m * m;
    const m3 = m2 * m;

    // Control points: P0=(45,68), P1=(95,44), P2=(145,44), Pmid=(180,68)
    x = m3 * 45 + 3 * m2 * u * 95 + 3 * m * u2 * 145 + u3 * 180;
    y = m3 * 68 + 3 * m2 * u * 44 + 3 * m * u2 * 44 + u3 * 68;

    dx = 3 * m2 * (95 - 45) + 6 * m * u * (145 - 95) + 3 * u2 * (180 - 145);
    dy = 3 * m2 * (44 - 68) + 6 * m * u * (44 - 44) + 3 * u2 * (68 - 44);
  } else {
    const u = (t - 0.5) / 0.5;
    const u2 = u * u;
    const u3 = u2 * u;
    const m = 1 - u;
    const m2 = m * m;
    const m3 = m2 * m;

    // Control points: Pmid=(180,68), P3=(215,92), P4=(265,92), P5=(315,68)
    x = m3 * 180 + 3 * m2 * u * 215 + 3 * m * u2 * 265 + u3 * 315;
    y = m3 * 68 + 3 * m2 * u * 92 + 3 * m * u2 * 92 + u3 * 68;

    dx = 3 * m2 * (215 - 180) + 6 * m * u * (265 - 215) + 3 * u2 * (315 - 265);
    dy = 3 * m2 * (92 - 68) + 6 * m * u * (92 - 92) + 3 * u2 * (68 - 92);
  }

  const rad = Math.atan2(dy, dx);
  const angleDeg = (rad * 180) / Math.PI;

  return { x, y, angleDeg };
}

export const RouteMap: React.FC<RouteMapProps> = React.memo(
  ({
    originCity,
    destinationCity,
    isInternational,
    borderName,
    borderWaitMinutes,
    progressPercent = 35,
    themeMode = 'light',
    highwayCode,
    distanceKm,
    estimatedDurationMinutes,
    currentSpeedKmH,
    statusNote,
    onPressBorder,
    onPressRoute,
    style,
    compact = false,
  }) => {
    const [showDetails, setShowDetails] = useState(false);

    // Resolve intelligent corridor metadata
    const meta = useMemo(
      () => resolveCorridorMetadata(originCity, destinationCity, isInternational),
      [originCity, destinationCity, isInternational]
    );

    const actualIsInternational = isInternational !== undefined ? isInternational : meta.isInternational;
    const actualHighway = highwayCode || meta.highwayCode;
    const actualBorderName = borderName || meta.borderName;
    const actualWaitMinutes =
      borderWaitMinutes !== undefined ? borderWaitMinutes : meta.defaultWaitMinutes;
    const actualDistance = distanceKm || meta.distanceKm;
    const actualDuration = estimatedDurationMinutes || meta.durationMinutes;

    const isDark = themeMode === 'dark';

    // Clamped progress
    const clampedProgress = Math.max(0, Math.min(100, progressPercent));

    // Calculate car position along the corridor
    const carPos = useMemo(() => getBezierPoint(clampedProgress), [clampedProgress]);

    // HUD Telemetry calculations
    const coveredKm = Math.round((clampedProgress / 100) * actualDistance);
    const remainingKm = Math.max(0, actualDistance - coveredKm);
    const remainingMinutes = Math.max(
      0,
      Math.round(((100 - clampedProgress) / 100) * actualDuration)
    );
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;
    const speed =
      currentSpeedKmH !== undefined
        ? currentSpeedKmH
        : clampedProgress > 0 && clampedProgress < 100
        ? 84
        : 0;

    // Traffic congestion indicator color & label
    const trafficInfo = useMemo(() => {
      if (actualWaitMinutes <= 30) {
        return {
          label: 'Tezkor',
          color: '#10B981',
          bg: isDark ? '#0F261C' : COLORS.emerald[50],
          border: isDark ? '#163D2D' : COLORS.emerald[200],
          dotColor: '#10B981',
          desc: "Navbat kam, tirbandliksiz o'tish",
        };
      }
      if (actualWaitMinutes <= 60) {
        return {
          label: "O'rtacha",
          color: '#F59E0B',
          bg: isDark ? '#251B10' : COLORS.amber[50],
          border: isDark ? '#3D2817' : COLORS.amber[200],
          dotColor: '#F59E0B',
          desc: "Mo'tadil oqim, qisqa kutish",
        };
      }
      return {
        label: 'Tirband',
        color: '#EF4444',
        bg: isDark ? '#281417' : COLORS.red[50],
        border: isDark ? '#451F25' : COLORS.red[200],
        dotColor: '#EF4444',
        desc: "Katta navbat, rejalashtirish zarur",
      };
    }, [actualWaitMinutes, isDark]);

    // Animated Pulsating Radar Wave
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const pulseLoop = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }, [pulseAnim]);

    const wave1Scale = pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2.5],
    });
    const wave1Opacity = pulseAnim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0.7, 0.35, 0],
    });
    const wave2Scale = pulseAnim.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [1, 1, 2.1],
    });
    const wave2Opacity = pulseAnim.interpolate({
      inputRange: [0, 0.35, 0.7, 1],
      outputRange: [0, 0.5, 0.25, 0],
    });

    // Theme color palette
    const themeColors = {
      cardBg: isDark ? '#15171E' : '#FFFFFF',
      cardBorder: isDark ? '#272B35' : '#E2E8F0',
      canvasBg: isDark ? '#0C0D11' : '#F8FAFC',
      roadCasing: isDark ? '#272B35' : '#E2E8F0',
      roadBed: isDark ? '#15171E' : '#FFFFFF',
      roadDivider: isDark ? '#334155' : '#CBD5E1',
      roadActive: '#FF8800',
      roadActiveGlow: 'rgba(255, 136, 0, 0.35)',
      textPrimary: isDark ? '#FFFFFF' : '#0F172A',
      textSecondary: isDark ? '#94A3B8' : '#64748B',
      textMuted: isDark ? '#64748B' : '#94A3B8',
      hudBg: isDark ? '#12141A' : '#F1F5F9',
      hudBorder: isDark ? '#272B35' : '#E2E8F0',
      radarColor: '#FF8800',
    };

    const handleBorderPress = () => {
      Haptics.selection();
      if (onPressBorder) {
        onPressBorder();
      } else {
        setShowDetails((prev) => !prev);
      }
    };

    const handleHeaderPress = () => {
      Haptics.light();
      if (onPressRoute) {
        onPressRoute();
      } else {
        setShowDetails((prev) => !prev);
      }
    };

    // Corridor SVG path coordinates
    const roadD = 'M 45 68 C 95 44, 145 44, 180 68 C 215 92, 265 92, 315 68';

    // Approximate total road bezier length ~278 units
    const pathTotalLength = 278;
    const progressDashLength = (clampedProgress / 100) * pathTotalLength;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.cardBorder,
          },
          SHADOWS.md,
          style,
        ]}
      >
        {/* Top Header Ribbon */}
        <TouchableOpacity
          style={styles.headerRow}
          onPress={handleHeaderPress}
          activeOpacity={0.85}
        >
          <View style={styles.headerLeft}>
            {/* Highway Shield Emblem */}
            <View
              style={[
                styles.highwayShield,
                actualIsInternational
                  ? styles.highwayShieldInternational
                  : styles.highwayShieldDomestic,
              ]}
            >
              <Text style={styles.highwayCodeText}>{actualHighway}</Text>
            </View>

            <View style={styles.headerTitleColumn}>
              <View style={styles.headerTagRow}>
                <Text style={[styles.headerRouteTitle, { color: themeColors.textPrimary }]}>
                  {originCity} ➔ {destinationCity}
                </Text>
                {actualIsInternational && (
                  <Badge label="Xalqaro" flag="KZ" variant="brand" size="sm" />
                )}
              </View>
              <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
                {statusNote || meta.statusDescription}
              </Text>
            </View>
          </View>

          {/* Right GPS Live Pulse */}
          <View style={styles.headerRight}>
            <View style={styles.liveIndicator}>
              <View style={styles.livePulseDot} />
              <Text style={[styles.liveText, { color: themeColors.textSecondary }]}>
                GPS Faol
              </Text>
            </View>
            {showDetails ? (
              <ChevronUp size={16} color={themeColors.textSecondary} />
            ) : (
              <ChevronDown size={16} color={themeColors.textSecondary} />
            )}
          </View>
        </TouchableOpacity>

        {/* Interactive SVG Route Corridor Canvas */}
        <View
          style={[
            styles.canvasContainer,
            {
              backgroundColor: themeColors.canvasBg,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <Svg width="100%" height={140} viewBox="0 0 360 140">
            <Defs>
              <LinearGradient id="activeRoadGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={isDark ? '#10B981' : '#047857'} stopOpacity="1" />
                <Stop offset="1" stopColor={themeColors.roadActive} stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="originGlow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#10B981" stopOpacity="0.6" />
                <Stop offset="1" stopColor="#10B981" stopOpacity="0" />
              </LinearGradient>
              <LinearGradient id="destGlow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={themeColors.roadActive} stopOpacity="0.6" />
                <Stop offset="1" stopColor={themeColors.roadActive} stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Background Map Chart Subtle Grid Lines */}
            <Line x1="20" y1="35" x2="340" y2="35" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeWidth="1" strokeDasharray="3, 5" />
            <Line x1="20" y1="105" x2="340" y2="105" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeWidth="1" strokeDasharray="3, 5" />
            <Line x1="120" y1="20" x2="120" y2="120" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeWidth="1" strokeDasharray="2, 6" />
            <Line x1="240" y1="20" x2="240" y2="120" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeWidth="1" strokeDasharray="2, 6" />

            {/* Road Corridor - Layer 1: Road Glow / Shadow */}
            <Path
              d={roadD}
              stroke={themeColors.roadActiveGlow}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
            />

            {/* Road Corridor - Layer 2: Road Bed Casing */}
            <Path
              d={roadD}
              stroke={themeColors.roadCasing}
              strokeWidth={10}
              strokeLinecap="round"
              fill="none"
            />

            {/* Road Corridor - Layer 3: Road Asphalt Surface */}
            <Path
              d={roadD}
              stroke={themeColors.roadBed}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
            />

            {/* Road Corridor - Layer 4: Center Road Divider */}
            <Path
              d={roadD}
              stroke={themeColors.roadDivider}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="4, 4"
              fill="none"
            />

            {/* Road Corridor - Layer 5: Active Traveled Road Overlay */}
            {clampedProgress > 0 && (
              <Path
                d={roadD}
                stroke="url(#activeRoadGrad)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={`${progressDashLength}, ${pathTotalLength}`}
                fill="none"
              />
            )}

            {/* State Boundary / Border Post Demarcation Line (if international) */}
            {actualIsInternational && (
              <G>
                <Line
                  x1={180}
                  y1={26}
                  x2={180}
                  y2={110}
                  stroke={trafficInfo.color}
                  strokeWidth={1.5}
                  strokeDasharray="3, 3"
                  opacity={0.8}
                />
                <Circle cx={180} cy={68} r={14} fill={themeColors.cardBg} stroke={trafficInfo.color} strokeWidth={2} />
                <Circle cx={180} cy={68} r={4} fill={trafficInfo.color} />
              </G>
            )}

            {/* Origin Pin Marker at (45, 68) */}
            <G>
              <Circle cx={45} cy={68} r={16} fill="url(#originGlow)" />
              <Circle cx={45} cy={68} r={9} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
              <Circle cx={45} cy={68} r={3} fill="#FFFFFF" />
              {/* Origin City Label */}
              <SvgText
                x={45}
                y={32}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={themeColors.textPrimary}
              >
                {originCity}
              </SvgText>
              <SvgText
                x={45}
                y={106}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill={themeColors.textSecondary}
              >
                Jo'nash • 0 km
              </SvgText>
            </G>

            {/* Destination Pin Marker at (315, 68) */}
            <G>
              <Circle cx={315} cy={68} r={16} fill="url(#destGlow)" />
              <Circle
                cx={315}
                cy={68}
                r={9}
                fill={isDark ? '#F59E0B' : '#059669'}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
              <Circle cx={315} cy={68} r={3} fill="#FFFFFF" />
              {/* Destination City Label */}
              <SvgText
                x={315}
                y={32}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={themeColors.textPrimary}
              >
                {destinationCity}
              </SvgText>
              <SvgText
                x={315}
                y={106}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill={themeColors.textSecondary}
              >
                {`Manzil • ${actualDistance} km`}
              </SvgText>
            </G>
          </Svg>

          {/* Floating Border Post Badge (Midpoint, if international) */}
          {actualIsInternational && (
            <TouchableOpacity
              style={[
                styles.borderFloatingBadge,
                {
                  left: '50%',
                  top: 8,
                  backgroundColor: themeColors.cardBg,
                  borderColor: trafficInfo.border,
                },
                SHADOWS.sm,
              ]}
              onPress={handleBorderPress}
              activeOpacity={0.85}
            >
              <View style={[styles.trafficStatusDot, { backgroundColor: trafficInfo.dotColor }]} />
              <View style={styles.borderBadgeTextGroup}>
                <View style={styles.borderBadgeTitleRow}>
                  <ShieldCheck size={11} color={trafficInfo.color} />
                  <Text style={[styles.borderBadgeName, { color: themeColors.textPrimary }]} numberOfLines={1}>
                    {actualBorderName}
                  </Text>
                </View>
                <Text style={[styles.borderWaitText, { color: trafficInfo.color }]}>
                  {`Kutish: ~${actualWaitMinutes} daq (${trafficInfo.label})`}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Animated Moving Vehicle Token with Radar Waves */}
          <View
            pointerEvents="none"
            style={[
              styles.vehicleAnchor,
              {
                left: `${(carPos.x / 360) * 100}%`,
                top: `${(carPos.y / 140) * 100}%`,
              },
            ]}
          >
            {/* Pulsating Radar Wave 1 */}
            <Animated.View
              style={[
                styles.radarCircle,
                {
                  borderColor: themeColors.radarColor,
                  transform: [{ scale: wave1Scale }],
                  opacity: wave1Opacity,
                },
              ]}
            />
            {/* Pulsating Radar Wave 2 */}
            <Animated.View
              style={[
                styles.radarCircle,
                {
                  borderColor: themeColors.radarColor,
                  transform: [{ scale: wave2Scale }],
                  opacity: wave2Opacity,
                },
              ]}
            />

            {/* Vehicle Directional Token */}
            <View
              style={[
                styles.carPill,
                {
                  backgroundColor: isDark ? '#F59E0B' : '#059669',
                  transform: [{ rotate: `${carPos.angleDeg}deg` }],
                },
                SHADOWS.md,
              ]}
            >
              <Car size={13} color="#FFFFFF" />
            </View>

            {/* Progress / Speed Floating Tag */}
            <View
              style={[
                styles.carSpeedTag,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.cardBorder,
                },
                SHADOWS.sm,
              ]}
            >
              <Text style={[styles.carSpeedText, { color: themeColors.textPrimary }]}>
                {clampedProgress > 0 && clampedProgress < 100
                  ? `${clampedProgress}%`
                  : clampedProgress === 100
                  ? 'Yetib kelindi'
                  : 'Start'}
              </Text>
            </View>
          </View>
        </View>

        {/* HUD Informativ Lentasi (Cockpit Heads-Up Display) */}
        {!compact && (
          <View
            style={[
              styles.hudContainer,
              {
                backgroundColor: themeColors.hudBg,
                borderColor: themeColors.hudBorder,
              },
            ]}
          >
            {/* Widget 1: Remaining Distance */}
            <View style={styles.hudWidget}>
              <View style={styles.hudLabelRow}>
                <MapPin size={11} color={themeColors.textSecondary} />
                <Text style={[styles.hudLabel, { color: themeColors.textSecondary }]}>
                  QOLGAN MASOFA
                </Text>
              </View>
              <Text style={[styles.hudValue, { color: themeColors.textPrimary }]}>
                {`${remainingKm} km`}
              </Text>
              <Text style={[styles.hudSubValue, { color: themeColors.textMuted }]}>
                {`Jami: ${actualDistance} km`}
              </Text>
            </View>

            <View style={[styles.hudDivider, { backgroundColor: themeColors.hudBorder }]} />

            {/* Widget 2: Remaining Time */}
            <View style={styles.hudWidget}>
              <View style={styles.hudLabelRow}>
                <Clock size={11} color={themeColors.textSecondary} />
                <Text style={[styles.hudLabel, { color: themeColors.textSecondary }]}>
                  QOLGAN VAQT
                </Text>
              </View>
              <Text style={[styles.hudValue, { color: themeColors.textPrimary }]}>
                {remainingHours > 0
                  ? `${remainingHours}s ${remainingMins}m`
                  : `${remainingMins} daqiqa`}
              </Text>
              <Text style={[styles.hudSubValue, { color: themeColors.textMuted }]}>
                {`Yetib borish ~${actualDuration}m`}
              </Text>
            </View>

            <View style={[styles.hudDivider, { backgroundColor: themeColors.hudBorder }]} />

            {/* Widget 3: Speed / Status */}
            <View style={styles.hudWidget}>
              <View style={styles.hudLabelRow}>
                <Radio size={11} color={themeColors.textSecondary} />
                <Text style={[styles.hudLabel, { color: themeColors.textSecondary }]}>
                  HARAKAT
                </Text>
              </View>
              <Text style={[styles.hudValue, { color: themeColors.roadActive }]}>
                {speed > 0 ? `${speed} km/s` : 'Kutilmoqda'}
              </Text>
              <Text style={[styles.hudSubValue, { color: themeColors.textMuted }]}>
                {clampedProgress > 0 ? `${clampedProgress}% bosib o'tildi` : 'Hali boshlanmadi'}
              </Text>
            </View>
          </View>
        )}

        {/* Expandable Corridor Information Drawer */}
        {showDetails && (
          <View
            style={[
              styles.detailsDrawer,
              {
                backgroundColor: themeColors.hudBg,
                borderColor: themeColors.hudBorder,
              },
            ]}
          >
            <View style={styles.drawerHeaderRow}>
              <Info size={15} color="#3B82F6" />
              <Text style={[styles.drawerTitle, { color: themeColors.textPrimary }]}>
                Marshrut va Chegara Ko'rsatmalari
              </Text>
            </View>

            <View style={styles.drawerItem}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={[styles.drawerItemText, { color: themeColors.textSecondary }]}>
                <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                  Magistral kodi:
                </Text>{' '}
                {actualHighway} xalqaro avtomobil yo'li orqali qatnov.
              </Text>
            </View>

            {actualIsInternational && (
              <TouchableOpacity
                style={[
                  styles.borderActionCard,
                  {
                    backgroundColor: trafficInfo.bg,
                    borderColor: trafficInfo.border,
                  },
                ]}
                onPress={handleBorderPress}
                activeOpacity={0.8}
              >
                <ShieldCheck size={16} color={trafficInfo.color} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.borderActionTitle, { color: trafficInfo.color }]}>
                    {actualBorderName}
                  </Text>
                  <Text style={[styles.borderActionSubtitle, { color: themeColors.textSecondary }]}>
                    {trafficInfo.desc} • Kutish vaqti ~{actualWaitMinutes} daqiqa. Pasport va hujjatlar talab etiladi.
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.drawerFooterRow}>
              <Text style={[styles.drawerFootnote, { color: themeColors.textMuted }]}>
                OTAXI Telematics • Real vaqt rejimida yangilanadi
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  highwayShield: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highwayShieldInternational: {
    backgroundColor: '#0284C7', // Sky Blue highway sign
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  highwayShieldDomestic: {
    backgroundColor: '#059669', // Emerald highway sign
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  highwayCodeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  headerTitleColumn: {
    flex: 1,
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerRouteTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  intlFlagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
  },
  canvasContainer: {
    position: 'relative',
    height: 140,
    width: '100%',
    overflow: 'hidden',
  },
  borderFloatingBadge: {
    position: 'absolute',
    transform: [{ translateX: -80 }],
    width: 160,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  trafficStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  borderBadgeTextGroup: {
    flex: 1,
  },
  borderBadgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  borderBadgeName: {
    fontSize: 9,
    fontWeight: '700',
  },
  borderWaitText: {
    fontSize: 8.5,
    fontWeight: '600',
    marginTop: 1,
  },
  vehicleAnchor: {
    position: 'absolute',
    width: 32,
    height: 32,
    transform: [{ translateX: -16 }, { translateY: -16 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCircle: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  carPill: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  carSpeedTag: {
    position: 'absolute',
    top: -18,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    zIndex: 3,
  },
  carSpeedText: {
    fontSize: 8,
    fontWeight: '800',
  },
  hudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  hudWidget: {
    flex: 1,
    alignItems: 'center',
  },
  hudLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  hudLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hudValue: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  hudSubValue: {
    fontSize: 9.5,
    fontWeight: '500',
    marginTop: 1,
  },
  hudDivider: {
    width: 1,
    height: 28,
  },
  detailsDrawer: {
    padding: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drawerTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  drawerItemText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  borderActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  borderActionTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  borderActionSubtitle: {
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 2,
  },
  drawerFooterRow: {
    alignItems: 'center',
    marginTop: 2,
  },
  drawerFootnote: {
    fontSize: 9,
    fontWeight: '500',
  },
});
