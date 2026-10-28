import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface UseCountdownOptions {
  /**
   * Taymerning boshlang'ich davomiyligi (soniyalarda). Default: 600 (10 daqiqa).
   */
  initialSeconds?: number;
  /**
   * Agar backenddan aniq tugash vaqti (ISO timestamp) berilsa,
   * unga nisbatan real vaqt hisoblanadi.
   */
  expiresAt?: string | Date;
  /**
   * Avtomatik hisoblashni boshlash. Default: true.
   */
  autoStart?: boolean;
  /**
   * Taymer muddati tugaganda chaqiriladigan callback funksiya.
   */
  onExpire?: () => void;
  /**
   * Shoshilinch ogohlantirish chegarasi (soniyalarda). Default: 120 (2 daqiqa).
   */
  urgentThresholdSeconds?: number;
}

/**
 * useCountdown
 * 
 * 10 daqiqalik joy band qilish (seat lock) taymer hooki.
 * Daqiqalar, soniyalar, progress (0..1) va foizini (0..100) real vaqt rejimida qaytaradi.
 */
export const useCountdown = ({
  initialSeconds = 600, // 10 minutes default
  expiresAt,
  autoStart = true,
  onExpire,
  urgentThresholdSeconds = 120,
}: UseCountdownOptions = {}) => {
  // Compute initial duration
  const totalDuration = useMemo(() => {
    if (expiresAt) {
      const targetTime = new Date(expiresAt).getTime();
      const diffSec = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      return diffSec > 0 ? diffSec : initialSeconds;
    }
    return initialSeconds;
  }, [expiresAt, initialSeconds]);

  const [secondsLeft, setSecondsLeft] = useState<number>(totalDuration);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Synchronize when totalDuration or expiresAt changes
  useEffect(() => {
    if (expiresAt) {
      const targetTime = new Date(expiresAt).getTime();
      const diffSec = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setSecondsLeft(diffSec);
      if (diffSec <= 0) {
        setIsRunning(false);
        onExpireRef.current?.();
      }
    } else {
      setSecondsLeft(initialSeconds);
    }
  }, [expiresAt, initialSeconds]);

  // Timer interval engine
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Actions
  const reset = useCallback(
    (newSeconds?: number) => {
      const sec = newSeconds !== undefined ? newSeconds : initialSeconds;
      setSecondsLeft(sec);
      setIsRunning(true);
    },
    [initialSeconds]
  );

  const start = useCallback(() => {
    if (secondsLeft > 0) {
      setIsRunning(true);
    }
  }, [secondsLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (secondsLeft > 0) {
      setIsRunning(true);
    }
  }, [secondsLeft]);

  const addSeconds = useCallback((extraSeconds: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + extraSeconds));
  }, []);

  // Formatting & Progress calculations
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

  const isExpired = secondsLeft <= 0;
  const isUrgent = secondsLeft > 0 && secondsLeft <= urgentThresholdSeconds;

  // Progress: 0 (boshlang'ich) dan 1 (tugagan) gacha
  const progress = totalDuration > 0 ? Math.min(1, Math.max(0, (totalDuration - secondsLeft) / totalDuration)) : 1;
  const progressPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return {
    // Current time units
    secondsLeft,
    formattedTime,
    minutes,
    seconds,
    formattedMinutes,
    formattedSeconds,

    // Status flags
    isExpired,
    isUrgent,
    isRunning,

    // Progress metrics
    progress,
    progressPercent,
    totalDuration,

    // Controls
    start,
    pause,
    resume,
    reset,
    addSeconds,
  };
};

export default useCountdown;
