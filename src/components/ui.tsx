import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '../theme/use-theme';
import { fonts, radius, space, type } from '../theme/tokens';

export type IconName = ComponentProps<typeof Feather>['name'];

export function Icon({ name, size = 18, color }: { name: IconName; size?: number; color?: string }) {
  const { c } = useTheme();
  return <Feather name={name} size={size} color={color ?? c.ink} />;
}

/** STIX Two Text — for the few moments meant to be felt, not scanned. */
export function Display({
  size = 'lg',
  style,
  ...rest
}: TextProps & { size?: 'lg' | 'md' | 'xl' }) {
  const { c } = useTheme();
  const base =
    size === 'xl'
      ? { fontFamily: fonts.display, fontSize: 44, lineHeight: 50 }
      : size === 'lg'
        ? type.headingLg
        : type.headingMd;
  return <Text accessibilityRole="header" {...rest} style={[base, { color: c.ink }, style]} />;
}

type BodyVariant = 'body' | 'bodySm' | 'label' | 'button' | 'strong' | 'eyebrow';

/** IBM Plex Sans — the invisible workhorse. */
export function Body({
  variant = 'body',
  muted,
  accent,
  style,
  ...rest
}: TextProps & { variant?: BodyVariant; muted?: boolean; accent?: boolean }) {
  const { c } = useTheme();
  const v: TextStyle =
    variant === 'strong'
      ? { ...type.body, fontFamily: fonts.bodySemi }
      : variant === 'eyebrow'
        ? { ...type.label, letterSpacing: 0.7, textTransform: 'uppercase' }
        : type[variant];
  const color = accent ? c.accent : muted ? c.inkMuted : c.ink;
  return <Text {...rest} style={[v, { color }, style]} />;
}

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = true, edges = ['top'], contentStyle }: ScreenProps) {
  const { c } = useTheme();
  const inner = [styles.screenContent, contentStyle];
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.surface100 }}>
      {scroll ? (
        <ScrollView contentContainerStyle={inner} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, inner]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  highlighted,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  highlighted?: boolean;
}) {
  const { c } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.surface200, borderColor: highlighted ? c.accent + '4d' : c.line },
        style,
      ]}>
      {children}
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'quiet';
  size?: 'md' | 'sm';
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  kind = 'primary',
  size = 'md',
  icon,
  disabled,
  style,
  accessibilityHint,
}: ButtonProps) {
  const { c } = useTheme();
  const fg = kind === 'primary' ? c.surface100 : kind === 'quiet' ? c.accent : c.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'sm' && styles.buttonSm,
        kind === 'primary' && { backgroundColor: c.ink },
        kind === 'secondary' && { borderWidth: 1, borderColor: c.line, backgroundColor: c.surface100 },
        kind === 'quiet' && { paddingHorizontal: 0 },
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.75 },
        style,
      ]}>
      {icon ? <Feather name={icon} size={size === 'sm' ? 14 : 16} color={fg} /> : null}
      <Text style={[type.button, size === 'sm' && { fontSize: 13 }, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[styles.track, { backgroundColor: c.line }, style]}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: c.accent, borderRadius: radius.full }} />
    </View>
  );
}

/** A 1–5 self-report scale. Deliberately plain: five tappable numbers and two end labels. */
export function Scale({
  value,
  onChange,
  low,
  high,
  label,
}: {
  value?: number;
  onChange: (v: number) => void;
  low: string;
  high: string;
  label: string;
}) {
  const { c } = useTheme();
  return (
    <View style={{ gap: space[1] }} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <Pressable
              key={n}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${n}${n === 1 ? `, ${low}` : n === 5 ? `, ${high}` : ''}`}
              onPress={() => onChange(n)}
              style={[
                styles.scaleItem,
                selected
                  ? { borderColor: c.accent, borderWidth: 2, backgroundColor: c.accent + '1f' }
                  : { borderColor: c.line, backgroundColor: c.surface100 },
              ]}>
              <Text style={[type.button, { color: c.ink }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Body variant="bodySm" muted>
          {low}
        </Body>
        <Body variant="bodySm" muted>
          {high}
        </Body>
      </View>
    </View>
  );
}

export function Divider() {
  const { c } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line }} />;
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: space[2] }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 24,
    paddingTop: space[2],
    paddingBottom: space[4] + space[3],
    gap: space[3],
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space[3],
    gap: space[2],
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.full,
    paddingVertical: 14,
    paddingHorizontal: 22,
    minHeight: 48,
  },
  buttonSm: { paddingVertical: 8, paddingHorizontal: 18, minHeight: 36 },
  track: { height: 6, borderRadius: radius.full, overflow: 'hidden' },
  scaleItem: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
