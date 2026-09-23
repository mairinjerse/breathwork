/**
 * Exhale design tokens — exact values from the Exhale design system
 * (https://claude.ai/artifact/3jKpJz4LXJAoEeaf8bqM2q, tokens.json v4).
 * Treat the design system as the source of truth; update here when it changes.
 */

export type ThemeName = 'day' | 'night';

export type ColorTokens = {
  surface100: string;
  surface200: string;
  ink: string;
  inkMuted: string;
  accent: string;
  line: string;
};

export const colors: Record<ThemeName, ColorTokens> = {
  day: {
    surface100: '#ffffff',
    surface200: '#f7f6f3',
    ink: '#14120f',
    inkMuted: '#6b6459',
    accent: '#e8622a',
    line: 'rgba(20,18,15,0.1)',
  },
  night: {
    surface100: '#10201f',
    surface200: '#16302c',
    ink: '#efe9da',
    inkMuted: '#9fb3ac',
    accent: '#e7a552',
    line: 'rgba(239,233,218,0.14)',
  },
};

/** Gradient-blob motif colors. Identical in both themes. Decorative only — never for text or controls. */
export const glow = {
  blue: '#9dc4e8',
  lavender: '#c7a8e0',
  pink: '#efa6c9',
  orange: '#f5872b',
  red: '#e8451f',
  yellow: '#f5c542',
} as const;

export const fonts = {
  display: 'STIXTwoText_500Medium',
  displaySemi: 'STIXTwoText_600SemiBold',
  body: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemi: 'IBMPlexSans_600SemiBold',
} as const;

export const type = {
  headingLg: { fontFamily: fonts.display, fontSize: 34, lineHeight: 39 },
  headingMd: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodySm: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19 },
  label: { fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.bodySemi, fontSize: 15, lineHeight: 20 },
} as const;

export const space = { 1: 6, 2: 12, 3: 20, 4: 32 } as const;

export const radius = { sm: 10, md: 14, full: 999 } as const;
