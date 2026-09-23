import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Blob } from '../../components/blob';
import { Body, Button, Card, Display, Icon, Row, Screen } from '../../components/ui';
import { CURRICULUM, PARTS, getModule, moduleIndex } from '../../content/curriculum';
import type { EvidenceLevel } from '../../content/types';
import { isModuleComplete } from '../../lib/progress';
import { humanDuration, practiceSeconds } from '../../lib/timeline';
import { useCurriculum } from '../../lib/use-curriculum';
import { useAppState } from '../../store/app-state';
import { radius, space } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

const EVIDENCE: Record<EvidenceLevel, string> = {
  strong: 'Strong evidence',
  moderate: 'Moderate evidence',
  emerging: 'Emerging evidence',
};

export default function ModuleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useAppState();
  const { statuses } = useCurriculum();
  const { c } = useTheme();
  const module = getModule(id);
  const index = moduleIndex(id);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={12}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      style={[styles.back, { backgroundColor: c.line }]}>
      <Icon name="arrow-left" size={16} color={c.inkMuted} />
    </Pressable>
  );

  if (!module || statuses[index] === 'locked') {
    return (
      <Screen>
        {back}
        <Display size="md">{module ? 'Not open yet' : 'Module not found'}</Display>
        <Body muted>{module ? 'Finish the previous module first — each one builds on the last.' : ''}</Body>
      </Screen>
    );
  }

  const p = state.progress[module.id] ?? {};
  const complete = isModuleComplete(p);
  const next = CURRICULUM[index + 1];
  const startSession = (guidance: 'guided' | 'solo') =>
    router.push({ pathname: '/session/[id]', params: { id: module.id, guidance } });

  return (
    <Screen>
      {back}

      <View style={{ gap: space[1] }}>
        <Body variant="eyebrow" muted>
          Module {index + 1} · {PARTS[module.part].title}
        </Body>
        <Display>{module.title}</Display>
        <Body muted>{module.summary}</Body>
      </View>

      <Steps done={[!!p.understood, !!p.guided, !!p.solo]} />

      <Section title="What it is">
        {module.what.map((t, i) => (
          <Body key={i}>{t}</Body>
        ))}
      </Section>

      <Section title="Why it works">
        {module.why.map((t, i) => (
          <Body key={i}>{t}</Body>
        ))}
        <View style={[styles.evidence, { borderColor: c.line }]}>
          <Row style={{ gap: space[1] }}>
            <Icon name="book" size={14} color={c.inkMuted} />
            <Body variant="label">{EVIDENCE[module.evidence.level]}</Body>
          </Row>
          <Body variant="bodySm" muted>
            {module.evidence.note}
          </Body>
        </View>
        {p.understood ? (
          <Row style={{ gap: space[1] }}>
            <Icon name="check" size={14} color={c.inkMuted} />
            <Body variant="bodySm" muted>
              Read
            </Body>
          </Row>
        ) : (
          <Button label="Got it" kind="secondary" onPress={() => actions.completeStep(module.id, 'understood')} />
        )}
      </Section>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Body variant="eyebrow" muted>
            Guided practice
          </Body>
          {p.guided ? <Icon name="check" size={14} color={c.inkMuted} /> : null}
        </Row>
        <Body variant="strong">
          {module.practice.name}
          {module.practice.kind === 'breath' && module.practice.pattern !== module.practice.name
            ? ` · ${module.practice.pattern}`
            : ''}
        </Body>
        <Body variant="bodySm" muted>
          {humanDuration(practiceSeconds(module.practice))} · the app paces you with cues
        </Body>
        <Button
          label={p.guided ? 'Practise again' : 'Start guided practice'}
          kind={p.guided ? 'secondary' : 'primary'}
          icon="play"
          onPress={() => startSession('guided')}
        />
      </Card>

      <Card style={!p.guided ? { opacity: 0.6 } : undefined}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Body variant="eyebrow" muted>
            On your own
          </Body>
          {p.solo ? <Icon name="check" size={14} color={c.inkMuted} /> : null}
        </Row>
        <Body>{module.solo.prompt}</Body>
        <Body variant="bodySm" muted>
          About {humanDuration(module.solo.seconds)} · no pacing, no counting — just a timer
        </Body>
        {p.guided ? (
          <View style={{ gap: space[1] }}>
            <Button
              label={p.solo ? 'Do it again' : 'Start on your own'}
              kind={p.solo ? 'secondary' : 'primary'}
              onPress={() => startSession('solo')}
            />
            {module.id === 'breath-under-pressure' && !p.solo ? (
              <Button
                label="I used it during my day"
                kind="quiet"
                onPress={() => {
                  actions.addOwnUse(module.id);
                  actions.completeStep(module.id, 'solo');
                }}
              />
            ) : null}
          </View>
        ) : (
          <Body variant="bodySm" muted>
            Opens after the guided practice.
          </Body>
        )}
      </Card>

      {complete ? (
        <Card style={{ gap: space[2] }}>
          <View style={styles.cornerBlob}>
            <Blob size={120} variant="warm" />
          </View>
          <Body variant="eyebrow" accent>
            Complete
          </Body>
          <Body variant="strong" style={{ paddingRight: 50 }}>
            You can do this without the app now.
          </Body>
          <Body muted>
            <Body variant="strong">When to use it: </Body>
            {module.whenToUse}
          </Body>
          {next ? (
            <Button
              label={`Next: ${next.title}`}
              onPress={() => router.replace({ pathname: '/module/[id]', params: { id: next.id } })}
            />
          ) : (
            <Button label="Back to home" onPress={() => router.navigate('/')} />
          )}
        </Card>
      ) : null}
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: space[2] }}>
      <Display size="md">{title}</Display>
      {children}
    </View>
  );
}

function Steps({ done }: { done: boolean[] }) {
  const { c } = useTheme();
  const labels = ['Understand', 'Guided', 'On your own'];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }} accessibilityLabel={`${done.filter(Boolean).length} of 3 steps done`}>
      {labels.map((l, i) => (
        <View key={l} style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 4, borderRadius: radius.full, backgroundColor: done[i] ? c.accent : c.line }} />
          <Body variant="bodySm" muted style={{ fontSize: 12 }}>
            {l}
          </Body>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space[1],
  },
  evidence: { borderWidth: 1, borderRadius: radius.sm, padding: space[2], gap: 4 },
  cornerBlob: { position: 'absolute', right: -30, top: -30, opacity: 0.55, pointerEvents: 'none' },
});

/** Pre-render one page per module for the static web/PWA build. */
export function generateStaticParams() {
  return CURRICULUM.map((m) => ({ id: m.id }));
}
