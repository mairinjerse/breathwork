import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Blob } from '../components/blob';
import { SupportRow } from '../components/support-row';
import { Body, Display, Icon, Screen } from '../components/ui';
import { SUPPORT_STATES, type SupportState } from '../content/support';
import { space } from '../theme/tokens';
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
    <Screen edges={['top', 'bottom']}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={() => router.back()}>
        <Icon name="x" size={20} color={c.inkMuted} />
      </Pressable>
      <View style={{ gap: space[1] }}>
        <Display>What’s going on?</Display>
        <Body muted>Pick what’s closest. You’ll go straight into it.</Body>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: space[2] }}>
        <Blob size={160} variant="full" drift />
      </View>

      <View style={{ gap: 10 }}>
        {SUPPORT_STATES.map((s) => (
          <SupportRow key={s.id} state={s} onPress={() => open(s)} />
        ))}
      </View>
    </Screen>
  );
}
