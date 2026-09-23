import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Body, Button, Display, Icon, Scale, Screen } from '../components/ui';
import { CHECK_IN_QUESTIONS, type CheckInKey } from '../content/check-in';
import { useAppState } from '../store/app-state';
import { space } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';

export default function CheckInScreen() {
  const { state, actions } = useAppState();
  const { c } = useTheme();
  const [answers, setAnswers] = useState<Partial<Record<CheckInKey, number>>>({});
  const complete = CHECK_IN_QUESTIONS.every((q) => answers[q.key] !== undefined);
  const first = state.checkIns.length === 0;

  return (
    <Screen edges={['top', 'bottom']}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={() => router.back()}>
        <Icon name="x" size={20} color={c.inkMuted} />
      </Pressable>
      <View style={{ gap: space[1] }}>
        <Display>{first ? 'Baseline' : 'Check-in'}</Display>
        <Body muted>
          {first
            ? 'Three questions about how things are now. Later check-ins compare against this, so you can see whether anything is actually changing.'
            : 'Same three questions as before. Answer for the last couple of weeks, not just today.'}
        </Body>
      </View>
      {CHECK_IN_QUESTIONS.map((q) => (
        <View key={q.key} style={{ gap: space[2] }}>
          <Body variant="strong">{q.question}</Body>
          <Scale
            label={q.question}
            value={answers[q.key]}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.key]: v }))}
            low={q.low}
            high={q.high}
          />
        </View>
      ))}
      <Button
        label="Save check-in"
        disabled={!complete}
        onPress={() => {
          actions.addCheckIn({
            stress: answers.stress!,
            recovery: answers.recovery!,
            selfReliance: answers.selfReliance!,
          });
          router.back();
        }}
      />
    </Screen>
  );
}
