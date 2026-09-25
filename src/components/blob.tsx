import { useEffect, useId, useState } from 'react';
import { Animated, Easing, Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Mask, RadialGradient, Rect, Stop } from 'react-native-svg';

import { glow } from '../theme/tokens';

/**
 * The gradient blob — Exhale's one signature motif. Layered radial gradients,
 * each fading to transparent, inside a soft circular mask, so it never reads
 * as a hard flat circle. Mirrors the reference implementation on the design
 * canvas (App-Session / Icon: layered CSS radial-gradients + blur).
 */

type Spot = { x: number; y: number; r: number; color: string; opacity?: number };

// Positions and radii follow the canvas references, as fractions of the blob size.
const VARIANTS: Record<BlobVariant, Spot[]> = {
  full: [
    { x: 0.3, y: 0.22, r: 0.46, color: glow.blue },
    { x: 0.68, y: 0.16, r: 0.46, color: glow.lavender },
    { x: 0.6, y: 0.52, r: 0.5, color: glow.pink },
    { x: 0.45, y: 0.76, r: 0.46, color: glow.orange },
    { x: 0.52, y: 0.92, r: 0.4, color: glow.red },
    { x: 0.2, y: 0.6, r: 0.32, color: glow.yellow, opacity: 0.85 },
  ],
  accent: [
    { x: 0.35, y: 0.3, r: 0.55, color: glow.blue },
    { x: 0.6, y: 0.6, r: 0.55, color: glow.orange },
    { x: 0.5, y: 0.9, r: 0.45, color: glow.red },
  ],
  cool: [
    { x: 0.35, y: 0.3, r: 0.62, color: glow.blue },
    { x: 0.62, y: 0.7, r: 0.62, color: glow.lavender },
  ],
  warm: [
    { x: 0.4, y: 0.3, r: 0.62, color: glow.pink },
    { x: 0.56, y: 0.7, r: 0.62, color: glow.orange },
  ],
  dusk: [
    { x: 0.35, y: 0.3, r: 0.62, color: glow.lavender },
    { x: 0.6, y: 0.72, r: 0.6, color: glow.pink },
  ],
};

export type BlobVariant = 'full' | 'accent' | 'cool' | 'warm' | 'dusk';

type Props = {
  size: number;
  variant?: BlobVariant;
  /** Very slow drift. Only the practice screen should turn this on. */
  drift?: boolean;
  /** Externally driven scale (e.g. breath pacing). */
  scale?: Animated.Value | Animated.AnimatedInterpolation<number>;
  /** How far the soft edge reaches inward (0–1). Small icons want less. */
  softness?: number;
  style?: StyleProp<ViewStyle>;
};

export function Blob({ size, variant = 'full', drift = false, scale, softness = 0.16, style }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const spots = VARIANTS[variant];
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!drift) return;
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 18000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: Platform.OS !== 'web',
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, t]);

  // Same drift as the canvas reference (scale 1 → 1.08, rotate 0 → 6°), slowed down.
  const rotate = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '6deg', '0deg'] });
  const driftScale = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.08, 1] });

  const transform: any[] = [];
  if (scale) transform.push({ scale });
  if (drift) transform.push({ rotate }, { scale: driftScale });

  return (
    <Animated.View style={[{ width: size, height: size }, transform.length ? { transform } : null, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {spots.map((s, i) => (
            <RadialGradient key={i} id={`${uid}g${i}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={s.color} stopOpacity={s.opacity ?? 1} />
              <Stop offset="0.4" stopColor={s.color} stopOpacity={(s.opacity ?? 1) * 0.72} />
              <Stop offset="0.75" stopColor={s.color} stopOpacity={(s.opacity ?? 1) * 0.22} />
              <Stop offset="1" stopColor={s.color} stopOpacity={0} />
            </RadialGradient>
          ))}
          <RadialGradient id={`${uid}m`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#fff" stopOpacity={1} />
            <Stop offset={String(1 - softness)} stopColor="#fff" stopOpacity={1} />
            <Stop offset="1" stopColor="#fff" stopOpacity={0} />
          </RadialGradient>
          <Mask id={`${uid}mask`} x="0" y="0" width="100" height="100" maskUnits="userSpaceOnUse">
            <Rect x="0" y="0" width="100" height="100" fill={`url(#${uid}m)`} />
          </Mask>
        </Defs>
        <G mask={`url(#${uid}mask)`}>
          {spots.map((s, i) => (
            <Circle key={i} cx={s.x * 100} cy={s.y * 100} r={s.r * 100} fill={`url(#${uid}g${i})`} />
          ))}
        </G>
      </Svg>
    </Animated.View>
  );
}

/** A small static blob used as an avatar or list marker. */
export function BlobDot({ size = 32, variant = 'accent' }: { size?: number; variant?: BlobVariant }) {
  return (
    <View style={{ width: size, height: size }}>
      <Blob size={size} variant={variant} softness={0.2} />
    </View>
  );
}
