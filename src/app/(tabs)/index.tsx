import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Blob, BlobDot } from '../../components/blob';
import { ModuleRow, listGap } from '../../components/module-row';
import { Body, Button, Card, Display, Icon, ProgressBar, Row, Screen } from '../../components/ui';
import { isCheckInDue, stepsDone } from '../../lib/progress';
import { humanDuration, practiceSeconds } from '../../lib/timeline';
import { useCurriculum } from '../../lib/use-curriculum';
import { useAppState } from '../../store/app-state';
import { radius, space } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

const STEP_NAMES = ['Understand it', 'Guided practice', 'On your own'];

function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { state } = useAppState();
  const { c } = useTheme();
  const { modules, statuses, current, completed, total, graduated } = useCurriculum();
  const checkInDue = isCheckInDue(state.checkIns, completed, total);

  // A short window of the curriculum around where the user is.
  const focus = graduated ? total - 1 : current;
  const start = Math.max(0, Math.min(focus - 1, total - 4));
  const windowed = modules.slice(start, start + 4);

  const toolkit = modules.filter((_, i) => statuses[i] === 'complete');

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', paddingTop: space[1] }}>
        <View style={{ gap: 4 }}>
          <Body variant="bodySm" muted>
            {greeting()}
            {state.settings.name ? `, ${state.settings.name}` : ''}
          </Body>
          <Display size="md" style={{ fontSize: 24 }}>
            exhale
          </Display>
        </View>
        <Pressable accessibilityRole="link" accessibilityLabel="Profile" onPress={() => router.navigate('/profile')}>
          <BlobDot size={34} variant="full" />
        </Pressable>
      </Row>

      {graduated ? (
        <Card style={{ gap: space[2] }}>
          <View style={styles.cornerBlob}>
            <Blob size={130} variant="accent" />
          </View>
          <Body variant="eyebrow" accent>
            Curriculum complete
          </Body>
          <Display size="md">You’re equipped.</Display>
          <Body muted>
            You’ve practised every technique with guidance and on your own. Use the toolkit below when you want it — and
            check in now and then to see how things are going.
          </Body>
        </Card>
      ) : (
        <ContinueCard index={current} />
      )}

      {checkInDue ? (
        <Pressable accessibilityRole="button" onPress={() => router.push('/check-in')}>
          <Card>
            <Row>
              <Icon name="edit-3" size={16} color={c.accent} />
              <View style={{ flex: 1, gap: 2 }}>
                <Body variant="strong">
                  {state.checkIns.length === 0 ? 'Take a baseline check-in' : 'Time for a check-in'}
                </Body>
                <Body variant="bodySm" muted>
                  Three quick questions, so you can see what changes over time.
                </Body>
              </View>
              <Icon name="chevron-right" size={16} color={c.inkMuted} />
            </Row>
          </Card>
        </Pressable>
      ) : null}

      <View style={{ gap: listGap }}>
        <Row style={{ justifyContent: 'space-between', marginTop: 4, marginBottom: 2 }}>
          <Body variant="eyebrow" muted>
            Your curriculum
          </Body>
          <Body variant="bodySm" muted>
            {completed} of {total} complete
          </Body>
        </Row>
        {windowed.map((m) => {
          const i = modules.indexOf(m);
          return <ModuleRow key={m.id} module={m} index={i} status={statuses[i]} progress={state.progress[m.id]} />;
        })}
        <Button label="See the whole curriculum" kind="quiet" onPress={() => router.navigate('/curriculum')} />
      </View>

      {toolkit.length > 0 ? (
        <View style={{ gap: listGap }}>
          <Body variant="eyebrow" muted>
            Your toolkit
          </Body>
          <Body variant="bodySm" muted>
            Techniques you’ve learned. Open one when you need it.
          </Body>
          <View style={styles.chips}>
            {toolkit.map((m) => (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityLabel={`Practise ${m.practice.name}`}
                onPress={() =>
                  router.push({ pathname: '/session/[id]', params: { id: m.id, guidance: 'guided', from: 'toolkit' } })
                }
                style={({ pressed }) => [
                  styles.chip,
                  { borderColor: c.line, backgroundColor: c.surface100 },
                  pressed && { opacity: 0.7 },
                ]}>
                <Body variant="bodySm">{m.practice.name}</Body>
                <Body variant="bodySm" muted>
                  {humanDuration(practiceSeconds(m.practice))}
                </Body>
              </Pressable>
            ))}
          </View>
        </View>
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
    <Card style={{ gap: 14 }}>
      <View style={styles.cornerBlob}>
        <Blob size={130} variant="accent" />
      </View>
      <Body variant="eyebrow" accent>
        {started ? 'Continue' : index === 0 ? 'Start here' : 'Up next'}
      </Body>
      <Body variant="strong" style={{ fontSize: 17, lineHeight: 23, paddingRight: 60 }}>
        Module {index + 1} · {m.title}
      </Body>
      <ProgressBar value={done / 3} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Body variant="bodySm" muted style={{ flex: 1 }}>
          {STEP_NAMES[Math.min(done, 2)]} · step {Math.min(done + 1, 3)} of 3
        </Body>
        <Button
          label={started ? 'Resume' : 'Start'}
          size="sm"
          onPress={() => router.push({ pathname: '/module/[id]', params: { id: m.id } })}
        />
      </Row>
    </Card>
  );
}

const styles = StyleSheet.create({
  cornerBlob: { position: 'absolute', right: -36, top: -36, opacity: 0.6, pointerEvents: 'none' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});
