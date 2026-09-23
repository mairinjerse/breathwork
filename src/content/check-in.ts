import type { CheckIn } from '../lib/progress';

export type CheckInKey = keyof Pick<CheckIn, 'stress' | 'recovery' | 'selfReliance'>;

/**
 * The periodic self-report. Three questions, each 1–5. Kept short on purpose:
 * it should take under 30 seconds, and it asks about a stretch of time, not today.
 */
export const CHECK_IN_QUESTIONS: {
  key: CheckInKey;
  title: string;
  question: string;
  low: string;
  high: string;
  /** Which direction is improvement. */
  better: 'up' | 'down';
}[] = [
  {
    key: 'stress',
    title: 'General stress',
    question: 'Over the past couple of weeks, how stressed have you generally felt?',
    low: 'Hardly',
    high: 'Very',
    better: 'down',
  },
  {
    key: 'recovery',
    title: 'Settling afterwards',
    question: 'When something stressful happens, how quickly do you settle afterwards?',
    low: 'Slowly',
    high: 'Quickly',
    better: 'up',
  },
  {
    key: 'selfReliance',
    title: 'Confidence on your own',
    question: 'How confident are you that you can calm yourself down without help?',
    low: 'Not at all',
    high: 'Very',
    better: 'up',
  },
];
