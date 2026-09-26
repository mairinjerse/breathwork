import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Blob } from '../../components/blob';
import { Body, Button, Display, Icon, Scale } from '../../components/ui';
import { FOCUSED_BREATHING } from '../../content/breathe';
import { CURRICULUM } from '../../content/curriculum';
import { SUPPORT_MODULE_IDS, getAnyModule } from '../../content/support';
import type { BreathPractice, GuidedPractice, Module } from '../../content/types';
import type { Guidance } from '../../lib/progress';
import {
  breathPositionAt,
  formatDuration,
  guidedPositionAt,
  practiceSeconds,
  volumeToScale,
} from '../../lib/timeline';
import { useAppState } from '../../store/app-state';
import { radius, space } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

type Stage = 'before' | 'running' | 'after' | 'summary';

/** A session shorter than this, abandoned, isn't worth recording. */
const MIN_RECORD_SECONDS = 20;
/** Resting pace for the blob during non-breath practices: 4s in, 6s out. */
const RESTING: BreathPractice = {
  kind: 'breath',
  id: 'resting',
  name: 'Resting',
  pattern: '',
  cycles: 10_000,
  phases: [
    { type: 'inhale', seconds: 4, label: '' },
    { type: 'exhale', seconds: 6, label: '' },
  ],
};

const KEEP_AWAKE_TAG = 'exhale-session';

export default function Session() {
  // Keep the screen on during practice. Best-effort: unsupported on some browsers.
  useEffect(() => {
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, []);
  const params = useLocalSearchParams<{
    id: string;
    guidance?: Guidance;
    from?: string;
    cycles?: string;
    supportId?: string;
  }>();
  const { state, actions } = useAppState();
  const { c } = useTheme();
  const module = getAnyModule(params.id);
  const guidance: Guidance = params.guidance === 'solo' ? 'solo' : 'guided';
  // Support and "Just breathe" sessions are free practice: no ratings, no curriculum progress.
  const freePractice = params.from === 'support' || params.from === 'breathe';
  const ratings = state.settings.sessionRatings && !freePractice;

  const [stage, setStage] = useState<Stage>(ratings ? 'before' : 'running');
  const [before, setBefore] = useState<number>();
  const [after, setAfter] = useState<number>();
  const result = useRef<{ startedAt: string; seconds: number; completed: boolean } | null>(null);

  if (!module) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.surface100, padding: 24 }}>
        <Body>That practice couldn’t be found.</Body>
        <Button label="Close" kind="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  let practice = module.practice;
  if (practice.kind === 'breath' && params.cycles) {
    practice = { ...practice, cycles: Math.max(1, Number(params.cycles) || practice.cycles) };
  }

  const record = (afterRating?: number) => {
    const r = result.current;
    if (!r) return;
    actions.addSession({
      practiceId: practice.id,
      moduleId: module.id,
      guidance,
      startedAt: r.startedAt,
      seconds: Math.round(r.seconds),
      completed: r.completed,
      before,
      after: afterRating,
      supportId: params.supportId,
    });
    if (r.completed && !freePractice) {
      actions.completeStep(module.id, guidance);
    }
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const onRunEnd = (seconds: number, completed: boolean, startedAt: string) => {
    result.current = { seconds, completed, startedAt };
    if (!completed) {
      if (seconds >= MIN_RECORD_SECONDS) record();
      close();
      return;
    }
    if (ratings) setStage('after');
    else {
      record();
      setStage('summary');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface100 }}>
      {stage === 'before' ? (
        <RatingStage
          title="Before you start"
          question="How activated do you feel right now?"
          value={before}
          onChange={setBefore}
          primary="Begin"
          onPrimary={() => setStage('running')}
          onClose={close}
        />
      ) : null}

      {stage === 'running' ? (
        <Runner module={module} practice={practice} guidance={guidance} onEnd={onRunEnd} />
      ) : null}

      {stage === 'after' ? (
        <RatingStage
          title="And now?"
          question="How activated do you feel now?"
          value={after}
          onChange={setAfter}
          primary="Done"
          onPrimary={() => {
            record(after);
            setStage('summary');
          }}
        />
      ) : null}

      {stage === 'summary' ? (
        <Summary module={module} guidance={guidance} before={before} after={after} onDone={close} />
      ) : null}
    </SafeAreaView>
  );
}

function CloseButton({ onPress, label = 'End session' }: { onPress: () => void; label?: string }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={12}
      onPress={onPress}
      style={[styles.close, { backgroundColor: c.line }]}>
      <Icon name="x" size={16} color={c.inkMuted} />
    </Pressable>
  );
}

function RatingStage(props: {
  title: string;
  question: string;
  value?: number;
  onChange: (v: number) => void;
  primary: string;
  onPrimary: () => void;
  onClose?: () => void;
}) {
  return (
    <View style={styles.stage}>
      <View style={styles.topBar}>{props.onClose ? <CloseButton onPress={props.onClose} label="Close" /> : null}</View>
      <View style={{ flex: 1, justifyContent: 'center', gap: space[3] }}>
        <Body variant="eyebrow" muted>
          {props.title}
        </Body>
        <Display size="md">{props.question}</Display>
        <Scale label={props.question} value={props.value} onChange={props.onChange} low="Calm" high="Very activated" />
      </View>
      <View style={{ gap: space[1] }}>
        <Button label={props.primary} onPress={props.onPrimary} />
        <Body variant="bodySm" muted style={{ textAlign: 'center' }}>
          {props.value ? ' ' : 'Optional — skip it if you’d rather not.'}
        </Body>
      </View>
    </View>
  );
}

function Runner({
  module,
  practice,
  guidance,
  onEnd,
}: {
  module: Module;
  practice: BreathPractice | GuidedPractice;
  guidance: Guidance;
  onEnd: (seconds: number, completed: boolean, startedAt: string) => void;
}) {
  const { state } = useAppState();
  const [startMs] = useState(() => Date.now());
  const [startedAt] = useState(() => new Date(startMs).toISOString());
  const [elapsed, setElapsed] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [volume] = useState(() => new Animated.Value(0));
  const phaseKey = useRef('');
  const ended = useRef(false);

  const solo = guidance === 'solo';
  const total = solo ? module.solo.seconds : practiceSeconds(practice);
  const pacer: BreathPractice | null = solo ? null : practice.kind === 'breath' ? practice : RESTING;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((Date.now() - startMs) / 1000), 200);
    return () => clearInterval(id);
  }, [startMs]);

  const finish = (completed: boolean) => {
    if (ended.current) return;
    ended.current = true;
    onEnd((Date.now() - startMs) / 1000, completed, startedAt);
  };

  useEffect(() => {
    if (elapsed >= total) finish(true);
  }, [elapsed, total]); // eslint-disable-line react-hooks/exhaustive-deps

  const breath = pacer ? breathPositionAt(pacer, elapsed) : null;
  const guided = !solo && practice.kind === 'guided' ? guidedPositionAt(practice, elapsed) : null;

  // On each new breath phase: animate the blob to the phase's target volume, and tap.
  useEffect(() => {
    if (!breath) return;
    const key = `${breath.cycle}:${breath.phaseIndex}`;
    if (key === phaseKey.current) return;
    const first = phaseKey.current === '';
    phaseKey.current = key;
    const progress = breath.phaseElapsed / breath.phase.seconds;
    volume.setValue(breath.fromVolume + (breath.toVolume - breath.fromVolume) * progress);
    Animated.timing(volume, {
      toValue: breath.toVolume,
      duration: Math.max(0, (breath.phase.seconds - breath.phaseElapsed) * 1000),
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    if (!first && practice.kind === 'breath' && state.settings.haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  });

  const sideKey = guided?.side;
  useEffect(() => {
    if (sideKey && state.settings.haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    }
  }, [sideKey, state.settings.haptics]);

  const stepIndex = guided?.stepIndex;
  useEffect(() => {
    if (stepIndex !== undefined && stepIndex > 0 && state.settings.haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [stepIndex, state.settings.haptics]);

  const scale = volume.interpolate({ inputRange: [0, 1], outputRange: [volumeToScale(0), volumeToScale(1)] });
  const blobSize = 320;

  let headline = '';
  let meta = '';
  let detail = '';
  if (solo) {
    headline = 'On your own';
    meta = `${formatDuration(elapsed)} of ${formatDuration(total)}`;
    detail = module.solo.prompt;
  } else if (practice.kind === 'breath' && breath) {
    headline = breath.phase.label;
    meta = `${practice.pattern} · Cycle ${breath.cycle + 1} of ${practice.cycles}`;
    detail = breath.phase.why ?? '';
  } else if (practice.kind === 'guided' && guided) {
    headline = guided.step.title;
    meta = `Step ${guided.stepIndex + 1} of ${practice.steps.length} · ${guided.stepRemaining}s`;
    detail = guided.step.instruction;
  }

  return (
    <View style={styles.stage}>
      <View style={styles.topBar}>
        <CloseButton onPress={() => finish(false)} />
        {solo || practice.kind === 'guided' ? null : (
          <Body variant="bodySm" muted accessibilityLabel={`${Math.round(total - elapsed)} seconds left`}>
            {formatDuration(Math.max(0, total - elapsed))}
          </Body>
        )}
      </View>

      <View style={styles.blobArea} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Blob size={blobSize} variant="full" drift={!reduceMotion} scale={solo ? undefined : scale} />
        {guided?.side ? <SideCue side={guided.side} /> : null}
      </View>

      <View style={styles.caption} accessibilityLiveRegion="polite">
        <Display size="md" style={{ fontSize: 30, lineHeight: 36, textAlign: 'center' }}>
          {headline}
        </Display>
        {!solo && breath && practice.kind === 'breath' ? (
          <Body muted style={{ textAlign: 'center' }}>
            {breath.phaseRemaining}
          </Body>
        ) : null}
        <Body variant="bodySm" muted style={{ textAlign: 'center' }}>
          {meta}
        </Body>
        <Body variant="bodySm" muted style={{ textAlign: 'center', marginTop: 8, minHeight: 40 }}>
          {detail}
        </Body>
        {solo ? (
          <Button
            label={elapsed >= total / 2 ? 'Finish' : 'Finish early'}
            kind="secondary"
            size="sm"
            style={{ alignSelf: 'center', marginTop: space[1] }}
            onPress={() => finish(elapsed >= total / 2)}
          />
        ) : null}
      </View>
    </View>
  );
}

function SideCue({ side }: { side: 'left' | 'right' }) {
  const { c } = useTheme();
  return (
    <View style={styles.sideCue}>
      {(['left', 'right'] as const).map((s) => (
        <View key={s} style={{ alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: radius.full,
              backgroundColor: side === s ? c.ink : c.line,
            }}
          />
          <Body variant="label" muted={side !== s}>
            {s === 'left' ? 'Left' : 'Right'}
          </Body>
        </View>
      ))}
    </View>
  );
}

function Summary({
  module,
  guidance,
  before,
  after,
  onDone,
}: {
  module: Module;
  guidance: Guidance;
  before?: number;
  after?: number;
  onDone: () => void;
}) {
  const shifted = before !== undefined && after !== undefined;
  return (
    <View style={styles.stage}>
      <View style={styles.topBar} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: space[3] }}>
        <Blob size={140} variant="full" />
        <Display style={{ textAlign: 'center' }}>Done.</Display>
        {shifted ? (
          <Body style={{ textAlign: 'center' }}>
            You went from {before} to {after}
            {after < before ? '.' : after === before ? ' — no change this time, which is useful to know too.' : '.'}
          </Body>
        ) : null}
        <Body muted style={{ textAlign: 'center', maxWidth: 340 }}>
          {guidance === 'solo' ? 'You did that without the app pacing you. That’s the skill.' : module.whenToUse}
        </Body>
      </View>
      <Button label="Back" onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, paddingHorizontal: 24, paddingBottom: space[4], width: '100%', maxWidth: 560, alignSelf: 'center' },
  topBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  blobArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  caption: { gap: 6, paddingHorizontal: 8, paddingBottom: space[3] },
  sideCue: { position: 'absolute', bottom: 0, flexDirection: 'row', gap: 120 },
});

/** Pre-render one page per module for the static web/PWA build. */
export function generateStaticParams() {
  return [
    ...CURRICULUM.map((m) => ({ id: m.id })),
    ...SUPPORT_MODULE_IDS.map((id) => ({ id })),
    { id: FOCUSED_BREATHING.id },
  ];
}
