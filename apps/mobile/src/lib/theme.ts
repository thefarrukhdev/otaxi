export const COLORS = {
  // OTAXI Brand: Taxi Orange & Luxury Obsidian Noir
  brand: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#FF8800', // Taxi Orange Primary
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    primary: '#FF8800',
    glow: 'rgba(255, 136, 0, 0.22)',
    subtle: 'rgba(255, 136, 0, 0.12)',
  },
  // Dark Luxury Palette
  noir: {
    bg: '#0C0D11',
    surface: '#15171E',
    surfaceElevated: '#1D2029',
    surfaceSubtle: '#252934',
    border: '#272B35',
    borderSubtle: '#1C1F28',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
    textSubtle: '#64748B',
  },
  // Amber / Accent
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Emerald / Green (Status indicators)
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  // Blue (Info/Cross-border)
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Red (Danger)
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Neutrals
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  navy: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
};

export const THEME = {
  // Passenger Dark Luxury Theme
  passenger: {
    isDark: true,
    background: '#0C0D11',
    surface: '#15171E',
    surfaceSubtle: '#1D2029',
    card: '#15171E',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
    textSubtle: '#64748B',
    primary: '#FF8800', // Taxi Orange
    primaryLight: '#FF9E2C',
    primaryDark: '#D97300',
    accent: '#FF8800',
    border: '#272B35',
    borderFocus: '#FF8800',
  },
  // Driver Cockpit Theme
  driver: {
    isDark: true,
    background: '#0C0D11',
    surface: '#15171E',
    surfaceSubtle: '#1D2029',
    card: '#15171E',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
    textSubtle: '#64748B',
    primary: '#FF8800',
    primaryLight: '#FF9E2C',
    primaryDark: '#D97300',
    accent: '#10B981',
    border: '#272B35',
    borderFocus: '#FF8800',
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  orangeGlow: {
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  otpCode: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: 6,
  },
};
