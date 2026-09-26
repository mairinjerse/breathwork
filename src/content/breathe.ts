import { CURRICULUM } from './curriculum';
import type { Module } from './types';

/**
 * "Just breathe": free practice, outside the curriculum. Sessions started from
 * here never tick off curriculum steps, so any breath technique can be used
 * whenever, without having to reach it in the curriculum first.
 */

export const FOCUSED_BREATHING: Module = {
  id: 'focused-breathing',
  part: 'breath',
  title: 'Focused Breathing',
  summary: 'Just you and your breath — 5.5 seconds in, 5.5 seconds out.',
  what: [
    'Slow, even breathing with nothing else to do: 5.5 seconds in, 5.5 seconds out. Let your attention rest on the breath, and when it wanders, bring it back.',
  ],
  why: [
    'At about 5.5 breaths a minute, your breathing falls into step with your blood-pressure reflex, which settles your heart rate and nervous system.',
  ],
  evidence: {
    level: 'strong',
    note: 'The same pace as resonance breathing, which has decades of HRV-biofeedback research behind it.',
  },
  practice: {
    kind: 'breath',
    id: 'focused-breathing',
    name: 'Focused breathing',
    pattern: '5.5 in · 5.5 out',
    cycles: 27,
    phases: [
      { type: 'inhale', seconds: 5.5, label: 'Inhale' },
      { type: 'exhale', seconds: 5.5, label: 'Exhale' },
    ],
  },
  solo: {
    prompt: 'Breathe at roughly this pace on your own. Close enough is fine.',
    seconds: 180,
  },
  whenToUse: 'Whenever you want a few quiet minutes. No reason needed.',
};

/** Session lengths offered for focused breathing, in minutes. */
export const FOCUSED_MINUTES = [2, 5, 10] as const;

/** Cycles of focused breathing that fill roughly `minutes`. */
export function focusedCycles(minutes: number): number {
  return Math.round((minutes * 60) / 11);
}

/** One line on what each breath technique is good for, shown on the "Just breathe" list. */
const BENEFITS: Record<string, string> = {
  foundations: 'Slows your heart rate with every breath. A good default when you’re not sure what to pick.',
  'physiological-sigh': 'The quickest way to take the edge off — often noticeable within one to three breaths.',
  'box-breathing': 'Keeps you calm but alert. Good before presenting or when under pressure.',
  'four-seven-eight': 'Deeply calming. Best for winding down or getting ready for sleep.',
  resonance: 'Trains your body’s own calming reflex. Most useful done regularly, a few times a week.',
};

export type BreathOption = { module: Module; benefit: string };

/** Every breath-paced technique in the curriculum, with its benefit line. */
export const BREATH_OPTIONS: BreathOption[] = CURRICULUM.filter((m) => m.practice.kind === 'breath').map((m) => ({
  module: m,
  benefit: BENEFITS[m.id] ?? m.summary,
}));
