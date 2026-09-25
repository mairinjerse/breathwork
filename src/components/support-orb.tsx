import { Pressable, StyleSheet, View } from 'react-native';

import type { SupportState } from '../content/support';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';
import { Body, Icon } from './ui';

/** One in-the-moment state: an icon orb with its label underneath. Used on Home and the support sheet. */
export function SupportOrb({ state, onPress, size = 72 }: { state: SupportState; onPress: () => void; size?: number }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={state.label}
      accessibilityHint={state.tagline}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.7 }]}>
      <View style={[styles.orb, { width: size, height: size, borderRadius: size / 2, backgroundColor: c.surface200 }]}>
        <Icon name={state.icon} size={22} color={c.accent} />
      </View>
      <Body variant="bodySm" style={{ textAlign: 'center' }}>
        {state.label}
      </Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, width: '31%' },
  orb: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.full },
});
