import { describe, expect, it } from '@jest/globals';

import { CURRICULUM } from '../../content/curriculum';
import type { BreathPractice, GuidedPractice } from '../../content/types';
import {
  breathPositionAt,
  formatDuration,
  guidedPositionAt,
  practiceSeconds,
  volumeToScale,
} from '../timeline';

const box: BreathPractice = {
  kind: 'breath',
  id: 'box',
  name: 'Box',
  pattern: '4-4-4-4',
  cycles: 2,
  phases: [
    { type: 'inhale', seconds: 4, label: 'Inhale' },
    { type: 'hold', seconds: 4, label: 'Hold' },
    { type: 'exhale', seconds: 4, label: 'Exhale' },
    { type: 'hold', seconds: 4, label: 'Hold' },
  ],
};

describe('breathPositionAt', () => {
  it('starts on the first inhale, empty', () => {
    const p = breathPositionAt(box, 0);
    expect(p).toMatchObject({ cycle: 0, phaseIndex: 0, fromVolume: 0, toVolume: 1, done: false });
    expect(p.phaseRemaining).toBe(4);
  });

  it('holds keep the volume they start at', () => {
    expect(breathPositionAt(box, 5)).toMatchObject({ phaseIndex: 1, fromVolume: 1, toVolume: 1 });
    expect(breathPositionAt(box, 13)).toMatchObject({ phaseIndex: 3, fromVolume: 0, toVolume: 0 });
  });

  it('counts down whole seconds', () => {
    expect(breathPositionAt(box, 0.2).phaseRemaining).toBe(4);
    expect(breathPositionAt(box, 3.9).phaseRemaining).toBe(1);
  });

  it('moves to the next cycle', () => {
    expect(breathPositionAt(box, 16)).toMatchObject({ cycle: 1, phaseIndex: 0 });
  });

  it('is done at the end and stays on the last phase', () => {
    const p = breathPositionAt(box, 32);
    expect(p).toMatchObject({ done: true, cycle: 1, phaseIndex: 3, phaseRemaining: 0 });
    expect(breathPositionAt(box, 999).done).toBe(true);
  });

  it('respects explicit volume targets (physiological sigh)', () => {
    const sigh = CURRICULUM.find((m) => m.id === 'physiological-sigh')!.practice as BreathPractice;
    expect(breathPositionAt(sigh, 1)).toMatchObject({ fromVolume: 0, toVolume: 0.8 });
    expect(breathPositionAt(sigh, 3)).toMatchObject({ fromVolume: 0.8, toVolume: 1 });
    expect(breathPositionAt(sigh, 5)).toMatchObject({ fromVolume: 1, toVolume: 0 });
  });
});

describe('guidedPositionAt', () => {
  const practice: GuidedPractice = {
    kind: 'guided',
    id: 'g',
    name: 'G',
    steps: [
      { title: 'A', instruction: '', seconds: 10 },
      { title: 'Tap', instruction: '', seconds: 10, alternate: 1 },
    ],
  };

  it('walks through steps', () => {
    expect(guidedPositionAt(practice, 0).stepIndex).toBe(0);
    expect(guidedPositionAt(practice, 10).stepIndex).toBe(1);
    expect(guidedPositionAt(practice, 20).done).toBe(true);
  });

  it('alternates sides only on alternating steps', () => {
    expect(guidedPositionAt(practice, 5).side).toBeUndefined();
    expect(guidedPositionAt(practice, 10.5).side).toBe('left');
    expect(guidedPositionAt(practice, 11.5).side).toBe('right');
    expect(guidedPositionAt(practice, 12.5).side).toBe('left');
  });
});

describe('helpers', () => {
  it('sums practice length', () => {
    expect(practiceSeconds(box)).toBe(32);
  });

  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
  });

  it('clamps blob scale', () => {
    expect(volumeToScale(-1)).toBeCloseTo(0.74);
    expect(volumeToScale(2)).toBe(1);
  });
});

describe('curriculum content', () => {
  it('has unique module and practice ids', () => {
    const ids = CURRICULUM.map((m) => m.id);
    const practiceIds = CURRICULUM.map((m) => m.practice.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(practiceIds).size).toBe(practiceIds.length);
  });

  it('keeps every guided practice short enough to finish', () => {
    for (const m of CURRICULUM) {
      const seconds = practiceSeconds(m.practice);
      expect(seconds).toBeGreaterThan(30);
      expect(seconds).toBeLessThanOrEqual(6 * 60);
    }
  });

  it('ends with the on-your-own module', () => {
    expect(CURRICULUM[CURRICULUM.length - 1].part).toBe('own');
  });
});
