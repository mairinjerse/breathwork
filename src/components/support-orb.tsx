import { Pressable, StyleSheet, View } from 'react-native';

import type { SupportState } from '../content/support';
import { glow, radius } from '../theme/tokens';
import { Blob } from './blob';
import { Body, Icon } from './ui';

/** One in-the-moment state: a mini colored orb with its label underneath. Used on Home and the support sheet. */
export function SupportOrb({ state, onPress, size = 72 }: { state: SupportState; onPress: () => void; size?: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={state.label}
      accessibilityHint={state.tagline}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.7 }]}>
      <View style={[styles.orb, { width: size, height: size, borderRadius: size / 2 }]}>
        <Blob size={size} color={glow[state.glow]} softness={0.16} style={StyleSheet.absoluteFill} />
        <Icon name={state.icon} size={22} color="#fff" />
      </View>
      <Body variant="bodySm" style={{ textAlign: 'center' }}>
        {state.label}
      </Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, width: 96 },
  orb: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, overflow: 'hidden' },
});
