import type { BreathPhase, BreathPractice, GuidedPractice, GuidedStep } from '../content/types';

/** Total length of a practice, in seconds. */
export function practiceSeconds(practice: BreathPractice | GuidedPractice): number {
  if (practice.kind === 'breath') {
    return cycleSeconds(practice) * practice.cycles;
  }
  return practice.steps.reduce((sum, s) => sum + s.seconds, 0);
}

export function cycleSeconds(practice: BreathPractice): number {
  return practice.phases.reduce((sum, p) => sum + p.seconds, 0);
}

export type BreathPosition = {
  done: boolean;
  /** 0-based cycle index. */
  cycle: number;
  phaseIndex: number;
  phase: BreathPhase;
  /** Seconds into the current phase. */
  phaseElapsed: number;
  /** Whole seconds left in the current phase, for the countdown (min 1 while running). */
  phaseRemaining: number;
  /** Lung volume (0–1) at the start of this phase. */
  fromVolume: number;
  /** Lung volume (0–1) at the end of this phase. */
  toVolume: number;
};

/** Volume a phase ends at, given the volume it starts at. */
export function phaseTarget(phase: BreathPhase, from: number): number {
  if (phase.to !== undefined) return phase.to;
  if (phase.type === 'inhale') return 1;
  if (phase.type === 'exhale') return 0;
  return from;
}

/** Where in a breath practice we are, `elapsed` seconds after it started. */
export function breathPositionAt(practice: BreathPractice, elapsed: number): BreathPosition {
  const cycleLen = cycleSeconds(practice);
  const total = cycleLen * practice.cycles;
  const done = elapsed >= total;
  const t = done ? total - 1e-9 : Math.max(0, elapsed);
  const cycle = Math.floor(t / cycleLen);
  let inCycle = t - cycle * cycleLen;

  // Volumes carry over between phases; a cycle always starts empty.
  let volume = 0;
  for (let i = 0; i < practice.phases.length; i++) {
    const phase = practice.phases[i];
    const to = phaseTarget(phase, volume);
    if (inCycle < phase.seconds || i === practice.phases.length - 1) {
      return {
        done,
        cycle,
        phaseIndex: i,
        phase,
        phaseElapsed: inCycle,
        phaseRemaining: done ? 0 : Math.max(1, Math.ceil(phase.seconds - inCycle)),
        fromVolume: volume,
        toVolume: to,
      };
    }
    inCycle -= phase.seconds;
    volume = to;
  }
  throw new Error('unreachable');
}

/** Blob scale for a lung volume. Kept subtle: it breathes, it doesn't pulse. */
export function volumeToScale(volume: number): number {
  const MIN = 0.74;
  const MAX = 1;
  return MIN + (MAX - MIN) * Math.min(1, Math.max(0, volume));
}

export type GuidedPosition = {
  done: boolean;
  stepIndex: number;
  step: GuidedStep;
  stepElapsed: number;
  stepRemaining: number;
  /** For alternating steps: which side to tap now. */
  side?: 'left' | 'right';
};

export function guidedPositionAt(practice: GuidedPractice, elapsed: number): GuidedPosition {
  const total = practiceSeconds(practice);
  const done = elapsed >= total;
  let t = done ? total - 1e-9 : Math.max(0, elapsed);
  for (let i = 0; i < practice.steps.length; i++) {
    const step = practice.steps[i];
    if (t < step.seconds || i === practice.steps.length - 1) {
      const side = step.alternate
        ? Math.floor(t / step.alternate) % 2 === 0
          ? 'left'
          : 'right'
        : undefined;
      return {
        done,
        stepIndex: i,
        step,
        stepElapsed: t,
        stepRemaining: done ? 0 : Math.max(1, Math.ceil(step.seconds - t)),
        side,
      };
    }
    t -= step.seconds;
  }
  throw new Error('unreachable');
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** "2 min", "45 sec" — for labels, rounded to something a person would say. */
export function humanDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  return `${Math.round(seconds / 60)} min`;
}
