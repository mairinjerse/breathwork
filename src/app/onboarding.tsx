import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Blob } from '../components/blob';
import { Body, Button, Display, Screen } from '../components/ui';
import { useAppState } from '../store/app-state';
import { space } from '../theme/tokens';

/**
 * Two screens, then straight into a real practice. Value before setup:
 * the baseline check-in is offered afterwards from Home, not demanded here.
 */
export default function Onboarding() {
  const { actions } = useAppState();
  const [step, setStep] = useState<'welcome' | 'try' | 'after'>('welcome');

  if (step === 'welcome') {
    return (
      <Screen scroll={false} edges={['top', 'bottom']} contentStyle={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', gap: space[3] }}>
          <Blob size={180} variant="full" style={{ alignSelf: 'flex-start', marginLeft: -20 }} />
          <Display size="xl">exhale</Display>
          <Body style={{ fontSize: 17, lineHeight: 26 }}>
            Your breath, posture and touch reach your nervous system before your thoughts do. Exhale teaches you how
            that works, and how to use it — well enough that you won’t need an app for it.
          </Body>
          <Body muted>No streaks, no daily reminders. A curriculum with an end.</Body>
        </View>
        <Button label="Continue" onPress={() => setStep('try')} />
      </Screen>
    );
  }

  if (step === 'try') {
    return (
      <Screen scroll={false} edges={['top', 'bottom']} contentStyle={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', gap: space[3] }}>
          <Body variant="eyebrow" accent>
            Try it first · 30 seconds
          </Body>
          <Display>Three physiological sighs</Display>
          <Body>
            Two breaths in through the nose — one deep, one short top-up — then a long, slow breath out through the
            mouth. Follow the shape on screen.
          </Body>
          <Body muted>You can sit, stand, or keep your eyes open. There’s no wrong way to do this one.</Body>
        </View>
        <View style={{ gap: space[1] }}>
          <Button
            label="Begin"
            icon="play"
            onPress={() => {
              setStep('after');
              router.push({
                pathname: '/session/[id]',
                params: { id: 'physiological-sigh', guidance: 'guided', cycles: '3', from: 'onboarding' },
              });
            }}
          />
          <Button label="Skip for now" kind="quiet" onPress={() => setStep('after')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} edges={['top', 'bottom']} contentStyle={{ justifyContent: 'space-between' }}>
      <View style={{ flex: 1, justifyContent: 'center', gap: space[3] }}>
        <Display>How this works</Display>
        <Point n="1" title="Eleven modules, in order">
          Breath first, then eyes, touch and movement. Each explains the mechanism in plain language.
        </Point>
        <Point n="2" title="Guided, then on your own">
          You practise each technique with the app pacing you, then again without it.
        </Point>
        <Point n="3" title="See whether it’s working">
          Quick ratings before and after sessions, and a short check-in now and then — less often as you go.
        </Point>
      </View>
      <Button label="Start the curriculum" onPress={() => actions.finishOnboarding()} />
    </Screen>
  );
}

function Point({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: space[2] }}>
      <Body variant="strong" accent>
        {n}
      </Body>
      <View style={{ flex: 1, gap: 2 }}>
        <Body variant="strong">{title}</Body>
        <Body muted>{children}</Body>
      </View>
    </View>
  );
}
