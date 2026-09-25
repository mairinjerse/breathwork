import { getModule } from './curriculum';
import type { Module } from './types';
import type { IconName } from '../components/ui';
import type { glow } from '../theme/tokens';

/**
 * In-the-moment support: five named acute states, each routed straight into a
 * practice with no browsing. These modules deliberately sit outside
 * `CURRICULUM` — they never unlock/lock in sequence and never appear in the
 * regular curriculum list.
 */

export type SupportStateId = 'sudden-sadness' | 'boredom' | 'panic' | 'anger' | 'overwhelm' | 'focus';

export type SupportState = {
  id: SupportStateId;
  label: string;
  tagline: string;
  icon: IconName;
  moduleId: string;
  /** The blob motif hue this state's orb is drawn in. */
  glow: keyof typeof glow;
};

export const SUPPORT_MODULES: Module[] = [
  {
    id: 'name-and-soothe',
    part: 'body',
    title: 'Name It, Then Soothe',
    summary: 'A moment to name what you feel, then steady touch.',
    what: [
      'A brief pause to name what’s here, if you want to — a feeling, a few words, nothing to explain. Then the butterfly hug: crossed arms, slow alternating taps.',
    ],
    why: [
      'Putting a rough label on a feeling tends to turn down activity in the brain’s alarm centre, even without doing anything else about it.',
      'Slow, alternating touch activates nerve fibres linked to a lower stress response — part of why being held is calming.',
    ],
    evidence: {
      level: 'emerging',
      note: 'Affect labelling’s calming effect is a replicated finding. The touch and tapping mechanisms are shared with the butterfly hug module.',
    },
    practice: {
      kind: 'guided',
      id: 'name-and-soothe',
      name: 'Name it, then soothe',
      steps: [
        {
          title: 'Name it',
          instruction: 'Name what’s here, if you want to — a feeling, a few words. No need to explain it.',
          seconds: 15,
        },
        {
          title: 'Position',
          instruction: 'Cross your arms over your chest, fingertips just below the opposite collarbones. Let your elbows drop.',
          seconds: 15,
        },
        { title: 'Tap', instruction: 'Tap slowly, alternating sides. Follow the cue.', seconds: 45, alternate: 1 },
        { title: 'Pause', instruction: 'Stop tapping. Keep your hands where they are and take one slow breath.', seconds: 15 },
        { title: 'Tap again', instruction: 'A second round, a little slower.', seconds: 45, alternate: 1.25 },
        { title: 'Notice', instruction: 'Let your hands rest. Notice the warmth and weight where they were.', seconds: 15 },
      ],
    },
    solo: {
      prompt: 'Tap on your own at a slow, steady pace for a minute. Find the rhythm that feels settling to you.',
      seconds: 60,
    },
    whenToUse: 'When sadness hits suddenly and you want steadying, not distraction.',
  },
  {
    id: 'urge-surfing',
    part: 'body',
    title: 'Riding Out Boredom',
    summary: 'Let the pull toward your phone rise and pass, without acting on it.',
    what: [
      'Boredom creates an urge — usually to reach for your phone. Urges are not commands: they rise, peak, and pass on their own, like a wave, if you let them without acting.',
      'This isn’t about fixing the boredom or finding something else to do. It’s about noticing the urge and staying with it until it eases.',
    ],
    why: [
      'Acting on an urge (grabbing the phone) reinforces it — you never learn it would have passed anyway. Riding it out, even once, weakens that link.',
      'Boredom itself is just understimulation, not a problem to solve. Treating it as tolerable rather than urgent is a skill, and it gets easier with practice.',
    ],
    evidence: {
      level: 'moderate',
      note: '"Urge surfing" comes from relapse-prevention and mindfulness-based approaches and has direct evidence for craving and compulsive-checking urges specifically.',
    },
    practice: {
      kind: 'guided',
      id: 'urge-surfing',
      name: 'Urge surfing',
      steps: [
        { title: 'Notice', instruction: 'Notice the pull — toward your phone, or anywhere else. Don’t act on it yet.', seconds: 20 },
        { title: 'Locate it', instruction: 'Where do you feel it in your body? Restlessness, an itch, a pull forward?', seconds: 25 },
        { title: 'Let it rise', instruction: 'Let it get as strong as it wants to. You’re not fighting it, just watching.', seconds: 30 },
        { title: 'Ride the peak', instruction: 'Stay with it. Urges peak and then ease, even when it doesn’t feel like they will.', seconds: 30 },
        { title: 'Notice the ease', instruction: 'Notice whatever shift happens, however small. The boredom itself is still there — that’s fine.', seconds: 25 },
      ],
    },
    solo: {
      prompt: 'Next time you reach for your phone out of boredom, pause for a minute first and notice the urge instead.',
      seconds: 60,
    },
    whenToUse: 'When you’re bored and reaching for your phone out of habit, not need.',
  },
];

export const SUPPORT_STATES: SupportState[] = [
  {
    id: 'panic',
    label: 'Panic',
    tagline: 'Fastest way to take the edge off, right now.',
    icon: 'zap',
    moduleId: 'physiological-sigh',
    glow: 'orange',
  },
  {
    id: 'anger',
    label: 'Anger',
    tagline: 'Use up the energy before you react.',
    icon: 'thermometer',
    moduleId: 'shaking',
    glow: 'red',
  },
  {
    id: 'overwhelm',
    label: 'Overwhelm',
    tagline: 'Too much coming in — narrow it down.',
    icon: 'layers',
    moduleId: 'grounding',
    glow: 'lavender',
  },
  {
    id: 'sudden-sadness',
    label: 'Sadness',
    tagline: 'Something steadying, instead of your phone.',
    icon: 'heart',
    moduleId: 'name-and-soothe',
    glow: 'blue',
  },
  {
    id: 'boredom',
    label: 'Boredom',
    tagline: 'Sit with it. It passes on its own.',
    icon: 'clock',
    moduleId: 'urge-surfing',
    glow: 'pink',
  },
  {
    id: 'focus',
    label: 'Need to focus',
    tagline: 'Steady, alert breathing before you dive in.',
    icon: 'target',
    moduleId: 'box-breathing',
    glow: 'yellow',
  },
];

export const SUPPORT_MODULE_IDS = SUPPORT_MODULES.map((m) => m.id);

export function getAnyModule(id: string): Module | undefined {
  return getModule(id) ?? SUPPORT_MODULES.find((m) => m.id === id);
}
