export type PhaseType = 'inhale' | 'hold' | 'exhale';

export type BreathPhase = {
  type: PhaseType;
  seconds: number;
  /** Word shown on the practice screen, e.g. "Inhale", "Sip in more". */
  label: string;
  /**
   * Lung volume (0 = empty, 1 = full) the phase ends at. Drives the blob's size.
   * Defaults: inhale → 1, exhale → 0, hold → unchanged.
   */
  to?: number;
  /** One-line mechanism note shown under the phase word with full guidance. */
  why?: string;
};

export type BreathPractice = {
  kind: 'breath';
  id: string;
  name: string;
  /** Short pattern label, e.g. "4-7-8". */
  pattern: string;
  phases: BreathPhase[];
  cycles: number;
};

export type GuidedStep = {
  title: string;
  instruction: string;
  seconds: number;
  /** Alternating left/right cue (bilateral tapping), in seconds per side. */
  alternate?: number;
};

export type GuidedPractice = {
  kind: 'guided';
  id: string;
  name: string;
  steps: GuidedStep[];
};

export type Practice = BreathPractice | GuidedPractice;

export type EvidenceLevel = 'strong' | 'moderate' | 'emerging';

export type Part = 'breath' | 'body' | 'own';

export type Module = {
  id: string;
  part: Part;
  title: string;
  /** One sentence for lists. */
  summary: string;
  /** "What it is" — plain description of the technique. */
  what: string[];
  /** "Why it works" — the mechanism, in plain language. */
  why: string[];
  evidence: { level: EvidenceLevel; note: string };
  practice: Practice;
  /** What to do in the unguided "on your own" round. */
  solo: { prompt: string; seconds: number };
  /** When to reach for it — shown on completion and in the toolkit. */
  whenToUse: string;
};
