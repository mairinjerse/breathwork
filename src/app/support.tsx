import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Body, Display, Icon, Screen } from '../components/ui';
import { SUPPORT_STATES, type SupportState } from '../content/support';
import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';

export default function SupportScreen() {
  const { c } = useTheme();

  const open = (s: SupportState) => {
    router.replace({
      pathname: '/session/[id]',
      params: { id: s.moduleId, guidance: 'guided', from: 'support', supportId: s.id },
    });
  };

  return (
    <Screen edges={['top', 'bottom']} scroll={false}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={() => router.back()}>
        <Icon name="x" size={20} color={c.inkMuted} />
      </Pressable>
      <View style={{ gap: space[1] }}>
        <Display>What’s going on?</Display>
        <Body muted>Pick what’s closest. You’ll go straight into it — nothing else to decide.</Body>
      </View>
      <View style={{ gap: space[2], flex: 1, justifyContent: 'center' }}>
        {SUPPORT_STATES.map((s) => (
          <Pressable
            key={s.id}
            accessibilityRole="button"
            accessibilityLabel={s.label}
            onPress={() => open(s)}
            style={({ pressed }) => [
              styles.card,
              { borderColor: c.line, backgroundColor: c.surface200 },
              pressed && { opacity: 0.75 },
            ]}>
            <View style={[styles.iconWrap, { backgroundColor: c.surface100 }]}>
              <Icon name={s.icon} size={20} color={c.ink} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Body variant="strong">{s.label}</Body>
              <Body variant="bodySm" muted>
                {s.tagline}
              </Body>
            </View>
            <Icon name="chevron-right" size={16} color={c.inkMuted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space[2],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
