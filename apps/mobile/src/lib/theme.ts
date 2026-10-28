export const COLORS = {
  // Brand colors
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
  // Driver theme colors (Navy / Gold)
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
};

export const THEME = {
  passenger: {
    isDark: false,
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    card: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    textSubtle: '#94A3B8',
    primary: '#059669', // Emerald Oasis
    primaryLight: '#D1FAE5',
    primaryDark: '#064E3B',
    accent: '#F43F5E',
    border: '#E2E8F0',
    borderFocus: '#059669',
  },
  driver: {
    isDark: true,
    background: '#090D16', // Obsidian Cockpit
    surface: '#111827', // Card Graphite
    surfaceSubtle: '#1E293B',
    card: '#111827',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    textSubtle: '#64748B',
    primary: '#F59E0B', // Amber Gold
    primaryLight: '#FEF3C7',
    primaryDark: '#B45309',
    accent: '#10B981', // Signal Emerald
    border: '#1F2937',
    borderFocus: '#F59E0B',
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
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
