import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Blob } from '../../components/blob';
import { SupportRow } from '../../components/support-row';
import { Body, Card, Display, Icon, ProgressBar, Row, Screen } from '../../components/ui';
import { SUPPORT_STATES, type SupportState } from '../../content/support';
import { isCheckInDue, stepsDone } from '../../lib/progress';
import { useCurriculum } from '../../lib/use-curriculum';
import { useAppState } from '../../store/app-state';
import { space } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

export default function Home() {
  const { state } = useAppState();
  const { current, completed, total, graduated } = useCurriculum();
  const checkInDue = isCheckInDue(state.checkIns, completed, total);

  const open = (s: SupportState) => {
    router.push({
      pathname: '/session/[id]',
      params: { id: s.moduleId, guidance: 'guided', from: 'support', supportId: s.id },
    });
  };

  return (
    <Screen>
      <View style={{ gap: 4, paddingTop: space[1] }}>
        <Display size="md">What’s going on?</Display>
        <Body muted>Pick what’s closest. You’ll go straight into it.</Body>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: space[2] }}>
        <Blob size={220} variant="full" drift />
      </View>

      <View style={{ gap: 10 }}>
        {SUPPORT_STATES.map((s) => (
          <SupportRow key={s.id} state={s} onPress={() => open(s)} />
        ))}
      </View>

      {!graduated ? <ContinueCard index={current} /> : null}

      {checkInDue ? (
        <Pressable accessibilityRole="button" onPress={() => router.push('/check-in')}>
          <CheckInNudge firstTime={state.checkIns.length === 0} />
        </Pressable>
      ) : null}
    </Screen>
  );
}

function ContinueCard({ index }: { index: number }) {
  const { state } = useAppState();
  const { modules } = useCurriculum();
  const m = modules[index];
  const done = stepsDone(state.progress[m.id]);
  const started = done > 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/module/[id]', params: { id: m.id } })}>
      <Card>
        <View style={{ gap: 2 }}>
          <Body variant="eyebrow" accent>
            {started ? 'Continue learning' : index === 0 ? 'Start the curriculum' : 'Up next'}
          </Body>
          <Body variant="strong">{m.title}</Body>
        </View>
        <ProgressBar value={done / 3} />
      </Card>
    </Pressable>
  );
}

function CheckInNudge({ firstTime }: { firstTime: boolean }) {
  const { c } = useTheme();
  return (
    <Card>
      <Row>
        <Icon name="edit-3" size={16} color={c.accent} />
        <View style={{ flex: 1, gap: 2 }}>
          <Body variant="strong">{firstTime ? 'Take a baseline check-in' : 'Time for a check-in'}</Body>
          <Body variant="bodySm" muted>
            Three quick questions, so you can see what changes over time.
          </Body>
        </View>
        <Icon name="chevron-right" size={16} color={c.inkMuted} />
      </Row>
    </Card>
  );
}
