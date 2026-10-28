import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IDriverLocationEvent } from '@otaxi/types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CoordinatePoint {
  latitude: number;
  longitude: number;
}

export interface CurrentCoords extends CoordinatePoint {
  heading: number;
}

export interface UseTrackingOptions {
  /** Safar identifikatori (berilmasa keyinroq startTracking bilan uzatilishi mumkin) */
  tripId?: string;
  /** Hook yuklanganda avtomatik kuzatuvni boshlash (sukut bo'yicha: false) */
  autoStart?: boolean;
  /** Reys xalqaro koridor ekanligi (sukut bo'yicha: true) */
  isInternational?: boolean;
  /** Koridor yo'nalishi ('TASHKENT_SHYMKENT' yoki 'TASHKENT_SAMARKAND') */
  routeType?: 'TASHKENT_SHYMKENT' | 'TASHKENT_SAMARKAND';
  /** Backend WebSocket manzili (sukut bo'yicha: ws://localhost:4000) */
  wsUrl?: string;
  /** Boshlang'ich simulyatsiya tezligi km/soatda (sukut bo'yicha: 88) */
  initialSpeed?: number;
}

export interface UseTrackingReturn {
  /** Socket.IO backend gateway bilan ulanish mavjudligi */
  isConnected: boolean;
  /** Joriy transport koordinatalari va harakat azimuti (gradus) */
  currentCoords: CurrentCoords;
  /** Joriy tezlik (km/soat) */
  speedKmH: number;
  /** Manzilgacha qolgan masofa (km) */
  remainingDistanceKm: number;
  /** Manzilgacha taxminiy qolgan vaqt (daqiqalarda) */
  remainingDurationMin: number;
  /** Eng yaqin davlat chegara postigacha bo'lgan masofa (xalqaro reyslarda) */
  borderDistanceKm?: number;
  /** Jonli kuzatuvni boshlash */
  startTracking: (tripId: string) => void;
  /** Jonli kuzatuvni to'xtatish */
  stopTracking: () => void;
}

// ============================================================================
// GEODESIC CONSTANTS & CORRIDORS
// ============================================================================

/** G'ishtko'prik / Chernyayevka chegara posti koordinatalari */
export const GISHTKOPRIK_BORDER_COORDS: CoordinatePoint = {
  latitude: 41.488,
  longitude: 69.378,
};

/** Toshkent -> Chimkent (M39 / A2 xalqaro tranzit magistrali) */
export const TASHKENT_SHYMKENT_WAYPOINTS: CoordinatePoint[] = [
  { latitude: 41.2995, longitude: 69.2401 }, // Toshkent markazi (Amir Temur)
  { latitude: 41.365, longitude: 69.289 }, // Yunusobod halqa yo'li
  { latitude: 41.41, longitude: 69.325 }, // Keles yaqini
  { latitude: 41.455, longitude: 69.355 }, // Chegara zonasiga kirish (~4.5 km gacha)
  { latitude: 41.488, longitude: 69.378 }, // G'ishtko'prik / Jibek Joli chegara bojxona posti
  { latitude: 41.512, longitude: 69.395 }, // Qozog'iston bojxonadan chiqish
  { latitude: 41.55, longitude: 69.415 }, // Sariog'och yo'li
  { latitude: 41.82, longitude: 69.485 }, // M39 / A2 to'g'ri magistral
  { latitude: 42.06, longitude: 69.535 }, // Qozig'urt dovoni etaklari
  { latitude: 42.27, longitude: 69.57 }, // Chimkent janubiy kirish darvozasi
  { latitude: 42.3417, longitude: 69.5901 }, // Chimkent markaziy Samal avtovokzali
];

/** Toshkent -> Samarqand (M39 Buyuk Ipak Yo'li ichki magistrali) */
export const TASHKENT_SAMARKAND_WAYPOINTS: CoordinatePoint[] = [
  { latitude: 41.275, longitude: 69.205 }, // Toshkent Bunyodkor
  { latitude: 41.115, longitude: 69.05 }, // Yangiyo'l
  { latitude: 40.94, longitude: 68.76 }, // Chinoz (Sirdaryo ko'prigi)
  { latitude: 40.84, longitude: 68.66 }, // Sirdaryo shahri
  { latitude: 40.52, longitude: 68.71 }, // Baxt / Guliston aylanmasi
  { latitude: 40.125, longitude: 67.842 }, // Jizzax aylanma yo'li
  { latitude: 39.76, longitude: 67.27 }, // Bulung'ur
  { latitude: 39.6542, longitude: 66.9597 }, // Samarqand Registon
];

// ============================================================================
// GEODESIC MATH UTILITIES (Haversine & Forward Azimuth)
// ============================================================================

/**
 * Ikki geografik nuqta orasidagi masofani (km) hisoblash (Haversine formulasi)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Yerning o'rtacha radiusi km da
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Ikki nuqta orasidagi harakat yo'nalish azimutini (heading 0-360°) hisoblash
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  return Math.round(bearing);
}

// ============================================================================
// SOCKET.IO LIGHTWEIGHT NATIVE CLIENT
// ============================================================================

/**
 * React Native uchun Socket.IO v4 protocol WebSocket mijozi
 * Hech qanday og'ir tashqi kutubxonalarsiz, to'g'ridan-to'g'ri /tracking namespasi bilan ishlaydi.
 */
class TrackingSocketClient {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private isNamespaceConnected = false;
  private currentTripId: string | null = null;
  private reconnectTimer: any = null;
  private heartbeatTimer: any = null;
  private shouldRun = false;
  private readonly baseUrl: string;
  private readonly namespace = '/tracking';

  private onLocationCallback?: (event: IDriverLocationEvent) => void;
  private onConnectionChangeCallback?: (connected: boolean) => void;

  constructor(baseUrl = 'ws://localhost:4000') {
    // Agar http:// yoki https:// uzatilgan bo'lsa, ws:// yoki wss:// ga o'tkazish
    this.baseUrl = baseUrl.replace(/^http/, 'ws');
  }

  public setCallbacks(
    onLocation: (event: IDriverLocationEvent) => void,
    onConnectionChange: (connected: boolean) => void
  ) {
    this.onLocationCallback = onLocation;
    this.onConnectionChangeCallback = onConnectionChange;
  }

  public connect(tripId: string) {
    this.currentTripId = tripId;
    this.shouldRun = true;
    this.openSocket();
  }

  public disconnect() {
    this.shouldRun = false;
    this.cleanupTimers();

    if (this.ws && this.isNamespaceConnected && this.currentTripId) {
      try {
        // Socket.IO event: trip:leave
        this.ws.send(`42${this.namespace},["trip:leave",{"tripId":"${this.currentTripId}"}]`);
        // Socket.IO disconnect from namespace
        this.ws.send(`41${this.namespace},`);
      } catch {
        // Ignorlash
      }
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // Ignorlash
      }
      this.ws = null;
    }

    this.isConnected = false;
    this.isNamespaceConnected = false;
    this.onConnectionChangeCallback?.(false);
  }

  private openSocket() {
    if (!this.shouldRun) return;

    try {
      const socketUrl = `${this.baseUrl}/socket.io/?EIO=4&transport=websocket`;
      this.ws = new WebSocket(socketUrl);

      this.ws.onopen = () => {
        // Engine.IO handshake boshlandi
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = () => {
        this.handleDisconnect();
      };

      this.ws.onclose = () => {
        this.handleDisconnect();
      };
    } catch {
      this.handleDisconnect();
    }
  }

  private handleMessage(data: any) {
    if (typeof data !== 'string') return;

    // Engine.IO Ping: '2' -> Pong '3'
    if (data === '2') {
      try {
        this.ws?.send('3');
      } catch {}
      return;
    }

    // Engine.IO Open: '0{"sid":"..."}'
    if (data.startsWith('0')) {
      // /tracking namespasiga ulanish uchun '40/tracking,' paketini yuborish
      try {
        this.ws?.send(`40${this.namespace},`);
      } catch {}
      return;
    }

    // Socket.IO Namespace Connect ACK: '40/tracking,{"sid":"..."}'
    if (data.startsWith(`40${this.namespace}`)) {
      this.isConnected = true;
      this.isNamespaceConnected = true;
      this.onConnectionChangeCallback?.(true);

      // Agar faol safar bo'lsa, xonaga a'zo bo'lish
      if (this.currentTripId) {
        try {
          this.ws?.send(
            `42${this.namespace},["trip:join",{"tripId":"${this.currentTripId}"}]`
          );
        } catch {}
      }
      return;
    }

    // Socket.IO Event: '42/tracking,["trip:location", {...}]'
    if (data.startsWith(`42${this.namespace},`)) {
      try {
        const payloadStr = data.substring(`42${this.namespace},`.length);
        const [eventName, eventData] = JSON.parse(payloadStr);

        if (eventName === 'trip:location' && eventData) {
          this.onLocationCallback?.(eventData as IDriverLocationEvent);
        }
      } catch {
        // Xatolik bo'lsa o'tkazib yuborish
      }
    }
  }

  private handleDisconnect() {
    this.isConnected = false;
    this.isNamespaceConnected = false;
    this.onConnectionChangeCallback?.(false);

    if (this.shouldRun && !this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        if (this.shouldRun) {
          this.openSocket();
        }
      }, 5000);
    }
  }

  private cleanupTimers() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// ============================================================================
// CUSTOM HOOK: useTracking
// ============================================================================

/**
 * useTracking
 * 
 * OTAXI Real-time Geolocation va WebSocket kuzatuv hooki.
 * Backend tracking gateway (/tracking namespasi, Socket.IO) orqali GPS ma'lumotlarni qabul qiladi.
 * Tarmoq uzilganda yoki backend o'chiq bo'lganda silliq interpolatsiya bilan har 3 soniyada
 * Toshkent -> Chimkent yoki Toshkent -> Samarqand trassalari bo'ylab avtomatik simulyatsiyani yuritadi.
 */
export function useTracking(options: UseTrackingOptions = {}): UseTrackingReturn {
  const {
    tripId: initialTripId,
    autoStart = false,
    isInternational = true,
    routeType = 'TASHKENT_SHYMKENT',
    wsUrl = 'ws://localhost:4000',
    initialSpeed = 88,
  } = options;

  // Marshrut nuqtalari
  const waypoints =
    routeType === 'TASHKENT_SHYMKENT'
      ? TASHKENT_SHYMKENT_WAYPOINTS
      : TASHKENT_SAMARKAND_WAYPOINTS;

  // Har bir marshrut kesimining masofasi va umumiy uzunligini hisoblash
  const { totalDistance, segmentLengths, cumDistances } = useMemo(() => {
    let total = 0;
    const segmentLengthsArr: number[] = [];
    const cumDistancesArr: number[] = [0];

    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const dist = calculateDistanceKm(
        p1.latitude,
        p1.longitude,
        p2.latitude,
        p2.longitude
      );
      segmentLengthsArr.push(dist);
      total += dist;
      cumDistancesArr.push(total);
    }

    return {
      totalDistance: total,
      segmentLengths: segmentLengthsArr,
      cumDistances: cumDistancesArr,
    };
  }, [waypoints]);

  // Boshlang'ich masofani belgilash (chegara ogohlantirishini yaqqol ko'rsatish uchun ~22 km ga joylash)
  const initialProgress = routeType === 'TASHKENT_SHYMKENT' ? Math.min(22, totalDistance * 0.2) : 10;

  // Holatlar (State)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeTripId, setActiveTripId] = useState<string | null>(initialTripId || null);
  const [isTracking, setIsTracking] = useState<boolean>(autoStart || Boolean(initialTripId));

  const [currentCoords, setCurrentCoords] = useState<CurrentCoords>(() => {
    const p1 = waypoints[0];
    const p2 = waypoints[1];
    const initialHeading = calculateBearing(
      p1.latitude,
      p1.longitude,
      p2.latitude,
      p2.longitude
    );
    return {
      latitude: p1.latitude,
      longitude: p1.longitude,
      heading: initialHeading,
    };
  });

  const [speedKmH, setSpeedKmH] = useState<number>(initialSpeed);
  const [remainingDistanceKm, setRemainingDistanceKm] = useState<number>(() => {
    return Math.max(0, Math.round((totalDistance - initialProgress) * 10) / 10);
  });
  const [remainingDurationMin, setRemainingDurationMin] = useState<number>(() => {
    return Math.max(1, Math.round(((totalDistance - initialProgress) / initialSpeed) * 60));
  });
  const [borderDistanceKm, setBorderDistanceKm] = useState<number | undefined>(() => {
    if (!isInternational) return undefined;
    const p1 = waypoints[0];
    return Math.round(
      calculateDistanceKm(
        p1.latitude,
        p1.longitude,
        GISHTKOPRIK_BORDER_COORDS.latitude,
        GISHTKOPRIK_BORDER_COORDS.longitude
      ) * 10
    ) / 10;
  });

  // Simulyatsiya o'zgaruvchilari
  const progressKmRef = useRef<number>(initialProgress);
  const simulationTimerRef = useRef<any>(null);
  const socketClientRef = useRef<TrackingSocketClient | null>(null);

  // ============================================================================
  // SILLIQ INTERPOLYATSIYA SIMULYATSIYASI (OFFLINE FALLBACK ENGINE)
  // ============================================================================

  const stepSimulation = useCallback(() => {
    // Magistral yo'ldagi tabiiy tezlik o'zgarishi (84 - 94 km/soat orasi)
    const randomizedSpeed = 88 + Math.round((Math.random() - 0.5) * 8);
    setSpeedKmH(randomizedSpeed);

    // 3 soniyada bosib o'tilgan masofa: (km/soat / 3600) * 3
    const deltaKm = (randomizedSpeed / 3600) * 3;
    let nextProgress = progressKmRef.current + deltaKm;

    // Marshrut oxiriga yetganda boshiga silliq qaytarish
    if (nextProgress >= totalDistance) {
      nextProgress = 0;
    }
    progressKmRef.current = nextProgress;

    // Joriy progress qaysi oraliqda (kesimda) ekanligini aniqlash
    let segmentIndex = 0;
    for (let i = 0; i < cumDistances.length - 1; i++) {
      if (nextProgress >= cumDistances[i] && nextProgress <= cumDistances[i + 1]) {
        segmentIndex = i;
        break;
      }
    }

    const pStart = waypoints[segmentIndex];
    const pEnd = waypoints[segmentIndex + 1] || waypoints[waypoints.length - 1];
    const segmentLength = segmentLengths[segmentIndex] || 0.001;
    const progressInSegment = nextProgress - cumDistances[segmentIndex];
    const t = Math.min(1, Math.max(0, progressInSegment / segmentLength));

    // Chiziqli silliq interpolatsiya
    const interpolatedLat = pStart.latitude + t * (pEnd.latitude - pStart.latitude);
    const interpolatedLng = pStart.longitude + t * (pEnd.longitude - pStart.longitude);
    const heading = calculateBearing(
      pStart.latitude,
      pStart.longitude,
      pEnd.latitude,
      pEnd.longitude
    );

    setCurrentCoords({
      latitude: interpolatedLat,
      longitude: interpolatedLng,
      heading,
    });

    // Qolgan masofa va vaqt
    const remKm = Math.max(0, Math.round((totalDistance - nextProgress) * 10) / 10);
    setRemainingDistanceKm(remKm);
    const remMin = Math.max(1, Math.round((remKm / randomizedSpeed) * 60));
    setRemainingDurationMin(remMin);

    // Chegara postigacha masofa (agar xalqaro reys bo'lsa)
    if (isInternational) {
      const bDist = calculateDistanceKm(
        interpolatedLat,
        interpolatedLng,
        GISHTKOPRIK_BORDER_COORDS.latitude,
        GISHTKOPRIK_BORDER_COORDS.longitude
      );
      setBorderDistanceKm(Math.round(bDist * 10) / 10);
    } else {
      setBorderDistanceKm(undefined);
    }
  }, [cumDistances, isInternational, segmentLengths, totalDistance, waypoints]);

  // Simulyatsiya taymerini boshqarish
  useEffect(() => {
    // Har doim kuzatuv faol bo'lsa va soketdan jonli yangilanish kelmayotgan bo'lsa,
    // har 3 soniyada silliq yangilanib turadi
    if (isTracking && !isConnected) {
      // Birinchi qadamni darhol bajarish
      stepSimulation();

      simulationTimerRef.current = setInterval(() => {
        stepSimulation();
      }, 3000);
    }

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
    };
  }, [isTracking, isConnected, stepSimulation]);

  // ============================================================================
  // WEBSOCKET JONLI KUZATUV (SOCKET.IO GATEWAY INTEGRATSIYASI)
  // ============================================================================

  const handleSocketLocation = useCallback(
    (event: IDriverLocationEvent) => {
      if (!event) return;

      const newLat = event.latitude;
      const newLng = event.longitude;
      const newSpeed = event.speed ?? 88;
      const newHeading = event.bearing ?? 0;

      setCurrentCoords({
        latitude: newLat,
        longitude: newLng,
        heading: newHeading,
      });

      setSpeedKmH(newSpeed);

      // Marshrut oxirigacha qolgan masofa
      const lastWaypoint = waypoints[waypoints.length - 1];
      const distToEnd = calculateDistanceKm(
        newLat,
        newLng,
        lastWaypoint.latitude,
        lastWaypoint.longitude
      );
      const remKm = Math.round(distToEnd * 10) / 10;
      setRemainingDistanceKm(remKm);

      const remMin = Math.max(1, Math.round((remKm / (newSpeed || 80)) * 60));
      setRemainingDurationMin(remMin);

      // Chegara masofasi
      if (isInternational) {
        const bDist = calculateDistanceKm(
          newLat,
          newLng,
          GISHTKOPRIK_BORDER_COORDS.latitude,
          GISHTKOPRIK_BORDER_COORDS.longitude
        );
        setBorderDistanceKm(Math.round(bDist * 10) / 10);
      }
    },
    [isInternational, waypoints]
  );

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  // TrackingSocketClient initsializatsiyasi
  useEffect(() => {
    const client = new TrackingSocketClient(wsUrl);
    client.setCallbacks(handleSocketLocation, handleConnectionChange);
    socketClientRef.current = client;

    if (isTracking && activeTripId) {
      client.connect(activeTripId);
    }

    return () => {
      client.disconnect();
      socketClientRef.current = null;
    };
  }, [activeTripId, isTracking, wsUrl, handleSocketLocation, handleConnectionChange]);

  // ============================================================================
  // PUBLIC ACTIONS
  // ============================================================================

  const startTracking = useCallback((tripId: string) => {
    setActiveTripId(tripId);
    setIsTracking(true);
    socketClientRef.current?.connect(tripId);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setActiveTripId(null);
    socketClientRef.current?.disconnect();

    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
  }, []);

  return {
    isConnected,
    currentCoords,
    speedKmH,
    remainingDistanceKm,
    remainingDurationMin,
    borderDistanceKm,
    startTracking,
    stopTracking,
  };
}
