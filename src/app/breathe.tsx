import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Blob } from '../components/blob';
import { Body, Button, Card, Display, Icon, Row, Screen } from '../components/ui';
import { BREATH_OPTIONS, FOCUSED_BREATHING, FOCUSED_MINUTES, focusedCycles } from '../content/breathe';
import type { Module } from '../content/types';
import { humanDuration, practiceSeconds } from '../lib/timeline';
import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';

export default function Breathe() {
  const { c } = useTheme();
  const [minutes, setMinutes] = useState<number>(5);

  const start = (module: Module, cycles?: number) =>
    router.push({
      pathname: '/session/[id]',
      params: { id: module.id, guidance: 'guided', from: 'breathe', ...(cycles ? { cycles: String(cycles) } : {}) },
    });

  return (
    <Screen>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={12}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={[styles.back, { backgroundColor: c.line }]}>
        <Icon name="arrow-left" size={16} color={c.inkMuted} />
      </Pressable>

      <View style={{ gap: space[1] }}>
        <Display>Just breathe</Display>
        <Body muted>No reason needed. Pick a pattern, or simply follow your breath.</Body>
      </View>

      <Card>
        <Row style={{ alignItems: 'flex-start' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Body variant="eyebrow" accent>
              5.5 in · 5.5 out
            </Body>
            <Body variant="strong">Focused breathing</Body>
            <Body variant="bodySm" muted>
              Nothing to count or hold. Breathe in for 5.5 seconds, out for 5.5, and keep your attention on the breath.
              This pace steadies your heart rate and quiets a busy mind.
            </Body>
          </View>
          <Blob size={64} variant="full" />
        </Row>

        <View style={{ flexDirection: 'row', gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel="Length">
          {FOCUSED_MINUTES.map((m) => {
            const selected = m === minutes;
            return (
              <Pressable
                key={m}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${m} minutes`}
                onPress={() => setMinutes(m)}
                style={[
                  styles.chip,
                  selected
                    ? { borderColor: c.accent, borderWidth: 2, backgroundColor: c.accent + '1f' }
                    : { borderColor: c.line, backgroundColor: c.surface100 },
                ]}>
                <Body variant="label">{m} min</Body>
              </Pressable>
            );
          })}
        </View>

        <Button label="Begin" icon="wind" onPress={() => start(FOCUSED_BREATHING, focusedCycles(minutes))} />
      </Card>

      <View style={{ gap: 10 }}>
        <Body variant="eyebrow" muted>
          Breathing types
        </Body>
        {BREATH_OPTIONS.map(({ module, benefit }) => (
          <Pressable
            key={module.id}
            accessibilityRole="button"
            accessibilityLabel={module.title}
            accessibilityHint={benefit}
            onPress={() => start(module)}
            style={({ pressed }) => [styles.option, { backgroundColor: c.surface200 }, pressed && { opacity: 0.7 }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Body variant="strong">{module.title}</Body>
              <Body variant="label" muted>
                {module.practice.kind === 'breath' ? module.practice.pattern : ''} ·{' '}
                {humanDuration(practiceSeconds(module.practice))}
              </Body>
              <Body variant="bodySm" muted style={{ marginTop: 2 }}>
                {benefit}
              </Body>
            </View>
            <Icon name="play" size={16} color={c.inkMuted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    padding: space[2],
    borderRadius: radius.md,
  },
});
