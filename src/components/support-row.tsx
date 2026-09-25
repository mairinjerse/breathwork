import { Pressable, View } from 'react-native';

import type { SupportState } from '../content/support';
import { glow, radius, space } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';
import { Body, Icon } from './ui';

/** One in-the-moment state: an icon, label and one-line context. Used on Home and the support sheet. */
export function SupportRow({ state, onPress }: { state: SupportState; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={state.label}
      accessibilityHint={state.tagline}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[2],
          padding: space[2],
          borderRadius: radius.md,
          backgroundColor: c.surface200,
        },
        pressed && { opacity: 0.7 },
      ]}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: glow[state.glow] + '30',
        }}>
        <Icon name={state.icon} size={18} color={glow[state.glow]} />
      </View>
      <View style={{ flex: 1, gap: 1 }}>
        <Body variant="strong">{state.label}</Body>
        <Body variant="bodySm" muted>
          {state.tagline}
        </Body>
      </View>
      <Icon name="chevron-right" size={16} color={c.inkMuted} />
    </Pressable>
  );
}
