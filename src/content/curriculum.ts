import type { Module, Part } from './types';

/**
 * The v1 curriculum. It has a real beginning, middle and end: breath first,
 * then the wider family of body-based regulation, then a final module whose
 * completion state is "you can do this without guidance".
 *
 * Evidence levels are deliberately conservative. The audience is skeptical;
 * overclaiming would cost more trust than it buys.
 */

export const PARTS: Record<Part, { title: string; blurb: string }> = {
  breath: {
    title: 'Breath',
    blurb: 'The one automatic body function you can also steer on purpose.',
  },
  body: {
    title: 'Beyond the breath',
    blurb: 'Eyes, touch and movement feed the same regulation system as breath does.',
  },
  own: {
    title: 'On your own',
    blurb: 'Picking the right tool for the moment, without the app.',
  },
};

export const CURRICULUM: Module[] = [
  {
    id: 'foundations',
    part: 'breath',
    title: 'Foundations',
    summary: 'How a longer exhale slows your heart, and why that matters.',
    what: [
      'Breathe in through your nose for 4 seconds, then out for 6. That is the whole technique: an exhale that is longer than the inhale.',
      'It is the base every later module builds on, so it is worth feeling it clearly before moving on.',
    ],
    why: [
      'Your autonomic nervous system runs heart rate, digestion and alertness without asking you. It has two broad modes: one that mobilises you (sympathetic) and one that settles you (parasympathetic).',
      'Breathing is the one automatic function you can also control on purpose, which makes it a lever into that system.',
      'Every time you inhale, your heart rate rises slightly; every time you exhale, the vagus nerve slows it back down. This is called respiratory sinus arrhythmia, and it happens in everyone. Make the exhale longer and you spend more of each breath with that brake applied.',
    ],
    evidence: {
      level: 'strong',
      note: 'The heart-rate effect of exhaling is well-established physiology. Evidence that slow breathing lowers self-reported stress is consistent across many studies, though effect sizes vary.',
    },
    practice: {
      kind: 'breath',
      id: 'extended-exhale',
      name: 'Extended exhale',
      pattern: '4 in · 6 out',
      cycles: 12,
      phases: [
        { type: 'inhale', seconds: 4, label: 'Inhale', why: 'In through the nose. Heart rate rises a little.' },
        { type: 'exhale', seconds: 6, label: 'Exhale', why: 'Long and slow. The vagus nerve slows your heart.' },
      ],
    },
    solo: {
      prompt: 'Breathe 4 in, 6 out at your own pace. Count in your head. The blob won’t pace you this time.',
      seconds: 120,
    },
    whenToUse: 'Any time you want to come down a notch. It is the default when you are not sure which tool to use.',
  },
  {
    id: 'physiological-sigh',
    part: 'breath',
    title: 'The Physiological Sigh',
    summary: 'The fastest way to take the edge off in real time.',
    what: [
      'Two inhales through the nose — one deep, then a short top-up sip — followed by a long, slow exhale through the mouth.',
      'You already do this without thinking: people sigh spontaneously every few minutes, and more often when stressed. Here you do it on purpose.',
    ],
    why: [
      'Your lungs are made of millions of tiny air sacs (alveoli). Under stress and shallow breathing, some of them partially deflate, which makes getting rid of carbon dioxide less efficient.',
      'The second, top-up inhale re-inflates them. The long exhale that follows then offloads CO2 more effectively and, like any long exhale, applies the vagal brake on your heart.',
      'Because it works through mechanics rather than attention, one to three sighs are often enough to notice a shift.',
    ],
    evidence: {
      level: 'moderate',
      note: 'A 2023 randomised study (Balban et al., Cell Reports Medicine) found five minutes a day of cyclic sighing improved mood and lowered breathing rate more than mindfulness meditation. One well-run study, built on long-established lung physiology.',
    },
    practice: {
      kind: 'breath',
      id: 'physiological-sigh',
      name: 'Physiological sigh',
      pattern: 'Double inhale · long exhale',
      cycles: 8,
      phases: [
        { type: 'inhale', seconds: 2.5, label: 'Inhale', to: 0.8, why: 'A deep breath in through the nose.' },
        { type: 'inhale', seconds: 1, label: 'Sip in more', to: 1, why: 'A short top-up. It re-opens collapsed air sacs.' },
        { type: 'exhale', seconds: 6.5, label: 'Exhale', why: 'Long and slow through the mouth. Carbon dioxide leaves.' },
      ],
    },
    solo: {
      prompt: 'Do three sighs on your own — double inhale, long exhale — then breathe normally and notice.',
      seconds: 60,
    },
    whenToUse: 'In the moment: before a hard conversation, after a jolt, when you notice your chest is tight.',
  },
  {
    id: 'box-breathing',
    part: 'breath',
    title: 'Box Breathing',
    summary: 'Even counts and holds, to build tolerance for rising CO2.',
    what: [
      'Four equal sides: inhale for 4, hold for 4, exhale for 4, hold for 4.',
      'It is steadier and more structured than the sigh — useful when you need to stay sharp rather than wind down.',
    ],
    why: [
      'The urge to breathe is driven mostly by carbon dioxide building up in your blood, not by running low on oxygen. People who are prone to anxiety tend to be more sensitive to that rising-CO2 signal, and it can feel like alarm.',
      'The holds let CO2 rise a little, in a safe and controlled way. Practised regularly, this can make the "air hunger" signal less alarming.',
      'Counting also occupies working memory, which leaves less room for the thought loop that was driving the stress.',
    ],
    evidence: {
      level: 'moderate',
      note: 'Widely used in military and first-responder training. In the 2023 Balban study, box breathing helped, though slightly less than the physiological sigh. The CO2-sensitivity link to anxiety is well documented.',
    },
    practice: {
      kind: 'breath',
      id: 'box-breathing',
      name: 'Box breathing',
      pattern: '4-4-4-4',
      cycles: 8,
      phases: [
        { type: 'inhale', seconds: 4, label: 'Inhale', why: 'Slow and even, through the nose.' },
        { type: 'hold', seconds: 4, label: 'Hold', why: 'Stay soft. CO2 is rising a little — that’s the training.' },
        { type: 'exhale', seconds: 4, label: 'Exhale', why: 'Even and unhurried.' },
        { type: 'hold', seconds: 4, label: 'Hold', why: 'Empty and still. Notice the urge to breathe, without obeying it yet.' },
      ],
    },
    solo: {
      prompt: 'Four rounds of 4-4-4-4 on your own. Trace a square with your eyes if it helps you keep count.',
      seconds: 90,
    },
    whenToUse: 'When you need to stay alert and composed — before presenting, in a tense meeting, under time pressure.',
  },
  {
    id: 'four-seven-eight',
    part: 'breath',
    title: '4-7-8 Breathing',
    summary: 'A long hold and a longer exhale, for winding down.',
    what: [
      'Inhale through the nose for 4, hold for 7, exhale through the mouth for 8.',
      'Keep to four cycles at first. The long hold can make you lightheaded until you are used to it.',
    ],
    why: [
      'The exhale is twice as long as the inhale, so most of each breath is spent with the vagal brake on.',
      'The hold slows your overall breathing rate to around three breaths a minute — far slower than the usual twelve to twenty — which pushes the system further toward rest.',
      'Because it is calming rather than sharpening, it suits the end of the day better than the middle of a meeting.',
    ],
    evidence: {
      level: 'emerging',
      note: 'Small studies show drops in heart rate and blood pressure after 4-7-8 breathing. The mechanism is sound, but it has been studied less than the other breath techniques here.',
    },
    practice: {
      kind: 'breath',
      id: 'four-seven-eight',
      name: '4-7-8',
      pattern: '4-7-8',
      cycles: 4,
      phases: [
        { type: 'inhale', seconds: 4, label: 'Inhale', why: 'Quietly, through the nose.' },
        { type: 'hold', seconds: 7, label: 'Hold', why: 'Your breathing rate drops to about three a minute.' },
        { type: 'exhale', seconds: 8, label: 'Exhale', why: 'Twice as long as the inhale. The brake stays on.' },
      ],
    },
    solo: {
      prompt: 'Four cycles of 4-7-8 on your own. If you lose count, let the exhale be the longest part and carry on.',
      seconds: 80,
    },
    whenToUse: 'Winding down: before sleep, after a long day, when your mind is still running but your body could rest.',
  },
  {
    id: 'resonance',
    part: 'breath',
    title: 'Resonance Breathing',
    summary: 'About 5.5 breaths a minute, to train your body’s own calming reflex.',
    what: [
      'Slow, even breathing: about 5.5 seconds in and 5.5 seconds out, for five minutes.',
      'It is the longest practice in the curriculum, and the one most worth doing regularly rather than only in hard moments.',
    ],
    why: [
      'You have pressure sensors in your major arteries (baroreceptors). When blood pressure rises, they slow the heart; when it falls, they speed it up. This is the baroreflex.',
      'Breathing at about six breaths a minute lines up the rhythm of your breath with the rhythm of that reflex, so the two amplify each other. Your heart rate swings more widely with each breath — which is what higher heart rate variability (HRV) means.',
      'Practising regularly appears to strengthen the reflex itself, so your body gets better at settling on its own, even when you are not doing the exercise.',
    ],
    evidence: {
      level: 'strong',
      note: 'The strongest evidence base here. Decades of HRV-biofeedback research (e.g. Lehrer and colleagues), and meta-analyses find meaningful reductions in stress and anxiety.',
    },
    practice: {
      kind: 'breath',
      id: 'resonance',
      name: 'Resonance breathing',
      pattern: '5.5 in · 5.5 out',
      cycles: 27,
      phases: [
        { type: 'inhale', seconds: 5.5, label: 'Inhale', why: 'Slow and smooth. No need to fill up completely.' },
        { type: 'exhale', seconds: 5.5, label: 'Exhale', why: 'Your breath and your blood-pressure reflex fall into step.' },
      ],
    },
    solo: {
      prompt: 'Three minutes at roughly this pace, on your own. Close enough is fine — it doesn’t need to be exact.',
      seconds: 180,
    },
    whenToUse: 'As regular maintenance — a few times a week — rather than only when something goes wrong.',
  },
  {
    id: 'breath-under-pressure',
    part: 'breath',
    title: 'Breath Under Pressure',
    summary: 'Using breath with your eyes open, mid-situation, without anyone noticing.',
    what: [
      'Everything so far has been practised sitting quietly. This module is about using it in the middle of things: in a meeting, in traffic, on a call.',
      'The sequence is short: notice the early signal, take one or two quiet sighs, then keep your exhale longer than your inhale for a few breaths while you carry on.',
    ],
    why: [
      'Stress responses start in the body before you consciously register them — a tight chest, fast shallow breathing, a clenched jaw. The earlier you notice, the less there is to undo.',
      'Trying to think your way calm (top-down) is slow when you are already activated. Changing your breathing (bottom-up) acts directly on the heart and works even while your attention is on something else.',
      'Noticing internal signals like these is called interoception. It is a skill, and it improves with practice.',
    ],
    evidence: {
      level: 'moderate',
      note: 'Builds on the breath techniques above. Research links better interoceptive awareness with better emotion regulation, though studies of in-the-moment use are harder to run.',
    },
    practice: {
      kind: 'guided',
      id: 'breath-under-pressure',
      name: 'Breath under pressure',
      steps: [
        {
          title: 'Eyes open',
          instruction: 'Keep your eyes open and look at something in the room, as if you were in a meeting.',
          seconds: 15,
        },
        {
          title: 'Find the signal',
          instruction: 'Scan quickly: chest, jaw, shoulders, belly. Where is the tension, if anywhere? Just notice it.',
          seconds: 20,
        },
        {
          title: 'Two quiet sighs',
          instruction: 'Two physiological sighs through the nose, exhaling quietly through the nose or barely-open lips.',
          seconds: 20,
        },
        {
          title: 'Longer out',
          instruction: 'Keep breathing normally, but let each exhale be a little longer than the inhale. No counting needed.',
          seconds: 40,
        },
        {
          title: 'Check',
          instruction: 'What changed — even slightly? Notice it, so you recognise it next time.',
          seconds: 15,
        },
      ],
    },
    solo: {
      prompt: 'Next time you notice tension during your day, run the sequence without opening the app. Come back and log it here.',
      seconds: 60,
    },
    whenToUse: 'Mid-situation, with people around, when stepping away to practise isn’t an option.',
  },
  {
    id: 'orienting',
    part: 'body',
    title: 'Orienting',
    summary: 'Slow, wide looking tells your brain the room is safe.',
    what: [
      'Let your head and eyes turn slowly around the space you are in, letting your gaze land on whatever draws it.',
      'It looks like nothing. It is one of the oldest safety checks mammals have.',
    ],
    why: [
      'Under threat, your visual field narrows and your neck and eyes lock onto the problem — tunnel vision is a real, physical part of the stress response.',
      'Part of how your brain decides whether you are safe is what your eyes report. Slowly scanning the environment and finding nothing chasing you gives it direct evidence to stand down.',
      'Widening your gaze to take in the edges of your vision (sometimes called panoramic vision) works against the narrowing that stress produces.',
    ],
    evidence: {
      level: 'emerging',
      note: 'Grounded in long-standing research on the orienting response in animals and widely used in trauma therapy. Controlled trials in people are limited so far.',
    },
    practice: {
      kind: 'guided',
      id: 'orienting',
      name: 'Orienting',
      steps: [
        { title: 'Settle', instruction: 'Sit comfortably. Let your eyes rest on something in front of you.', seconds: 15 },
        {
          title: 'Turn slowly',
          instruction: 'Let your head turn slowly to one side, letting your eyes drift over what is there. No hurry.',
          seconds: 30,
        },
        { title: 'Other side', instruction: 'Now slowly the other way. Let your gaze land on anything that interests it.', seconds: 30 },
        {
          title: 'Widen',
          instruction: 'Look straight ahead and, without moving your eyes, take in the edges of the room — above, below, both sides.',
          seconds: 25,
        },
        { title: 'Notice', instruction: 'Notice your breathing, your shoulders, your jaw. Has anything loosened?', seconds: 15 },
      ],
    },
    solo: {
      prompt: 'Look slowly around wherever you are for a minute, and let your gaze widen. No instructions this time.',
      seconds: 60,
    },
    whenToUse: 'When you feel on edge or hypervigilant, or when you have been staring at a screen and feel wired.',
  },
  {
    id: 'grounding',
    part: 'body',
    title: 'Grounding',
    summary: 'Moving your attention out of the thought loop and into your senses.',
    what: [
      'Deliberately shifting attention to what your senses are reporting right now: what you can see, hear and feel, and the weight of your body on the chair or floor.',
      'The structured version counts down: five things you can see, four you can feel, three you can hear, two you can smell, one you can taste.',
    ],
    why: [
      'Attention is limited. When it is taken up by a looping thought ("what if…"), the stress response keeps getting fed.',
      'Giving your attention concrete sensory work — outside you, in the present — competes with the loop for the same limited resource.',
      'Pressure and weight (feet on the floor, back against a chair) are processed by your body-position sense (proprioception), and firm, steady pressure tends to be settling.',
    ],
    evidence: {
      level: 'emerging',
      note: 'A standard technique in CBT and DBT for anxiety and dissociation. The attention mechanism is well understood; direct trials of grounding on its own are few.',
    },
    practice: {
      kind: 'guided',
      id: 'grounding',
      name: 'Grounding',
      steps: [
        { title: 'Feet and seat', instruction: 'Press your feet into the floor. Feel the weight of your body in the chair.', seconds: 20 },
        { title: 'Five you can see', instruction: 'Name five things you can see. Say them in your head, specifically.', seconds: 25 },
        { title: 'Four you can feel', instruction: 'Four things you can feel: fabric, air, the surface under your hands.', seconds: 25 },
        { title: 'Three you can hear', instruction: 'Three sounds, near or far. Include the quiet ones.', seconds: 20 },
        { title: 'Two and one', instruction: 'Two things you can smell, one you can taste. It’s fine if they are faint.', seconds: 20 },
      ],
    },
    solo: {
      prompt: 'Run 5-4-3-2-1 on your own, at your own pace.',
      seconds: 90,
    },
    whenToUse: 'When your thoughts are spinning or you feel detached from what is around you.',
  },
  {
    id: 'butterfly-hug',
    part: 'body',
    title: 'Bilateral Tapping & the Butterfly Hug',
    summary: 'Slow alternating taps and steady self-touch.',
    what: [
      'Cross your arms over your chest so each hand rests just below the opposite collarbone. Tap slowly, alternating left and right, about once a second.',
      'You can do a subtler version with hands on your thighs under a desk.',
    ],
    why: [
      'Slow, gentle touch activates a specific type of nerve fibre in the skin (C-tactile afferents) that responds to warm, soft contact. Signals from these fibres are linked with a lower stress response — it is part of why being held is calming.',
      'The alternating left-right rhythm comes from EMDR, a trauma therapy. A steady, predictable rhythm is itself settling, and it gives your attention something simple to follow.',
      'Honestly: whether the alternating part adds anything beyond rhythm and touch is still debated.',
    ],
    evidence: {
      level: 'emerging',
      note: 'The touch mechanism is well researched. Evidence that bilateral stimulation specifically matters is mixed, and the butterfly hug on its own has mostly been studied in small or field settings.',
    },
    practice: {
      kind: 'guided',
      id: 'butterfly-hug',
      name: 'Butterfly hug',
      steps: [
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
    whenToUse: 'When you feel overwhelmed or tearful and want something steadying you can do with your own hands.',
  },
  {
    id: 'shaking',
    part: 'body',
    title: 'Shaking & Gentle Movement',
    summary: 'Using up the energy the stress response gave you.',
    what: [
      'Standing, bounce gently on your heels, shake out your hands and arms, then let the whole body loosen and shake for a minute. Then stand still.',
      'It looks a bit silly, so it is one to do in private.',
    ],
    why: [
      'The stress response prepares you to move: adrenaline, extra glucose in the blood, tensed muscles. When the threat is an email, that preparation has nowhere to go.',
      'Movement uses up some of that mobilisation, and rhythmic movement in particular tends to settle the nervous system.',
      'The stillness afterwards matters too — the contrast makes it easier to notice what has changed.',
    ],
    evidence: {
      level: 'emerging',
      note: 'Physical activity reducing anxiety is strongly supported. Shaking specifically has little direct research; treat it as a short, gentle form of movement rather than anything special.',
    },
    practice: {
      kind: 'guided',
      id: 'shaking',
      name: 'Shaking',
      steps: [
        { title: 'Stand', instruction: 'Stand with feet hip-width apart, knees soft.', seconds: 10 },
        { title: 'Bounce', instruction: 'Bounce gently on your heels. Let your knees absorb it.', seconds: 40 },
        { title: 'Hands and arms', instruction: 'Keep bouncing and shake out your hands, then your arms.', seconds: 30 },
        { title: 'Whole body', instruction: 'Let it spread: shoulders, jaw, belly. Loose and a bit untidy is right.', seconds: 45 },
        { title: 'Still', instruction: 'Stop. Stand still and notice: warmth, tingling, your heartbeat, your breath.', seconds: 30 },
      ],
    },
    solo: {
      prompt: 'Shake it out on your own for a minute, then stand still for a few breaths.',
      seconds: 90,
    },
    whenToUse: 'When you feel wired, restless or stuck — too much energy and nowhere for it to go.',
  },
  {
    id: 'your-toolkit',
    part: 'own',
    title: 'Choosing Your Tool',
    summary: 'Read your own state, pick the technique, practise without guidance.',
    what: [
      'You now have ten techniques. This last module is about matching them to what is going on.',
      'Activated or jolted: the physiological sigh, or breath under pressure. Spinning thoughts: grounding or orienting. Winding down: 4-7-8 or resonance. Wired and restless: movement. Overwhelmed: the butterfly hug.',
    ],
    why: [
      'None of these techniques is best in general. They act on different parts of the same system — heart rate, attention, threat detection, muscle tension — so the right one depends on which part is driving how you feel.',
      'The goal of this curriculum was never for you to open the app every day. It was for you to recognise your own state and know what to do about it, anywhere.',
      'After this module you will have practised every technique both with guidance and on your own. The app stays here as a reference and a place to track whether things are changing — not as something you need.',
    ],
    evidence: {
      level: 'moderate',
      note: 'Matching technique to state follows from the mechanisms above. Being able to choose and apply a strategy flexibly is itself associated with better emotional wellbeing.',
    },
    practice: {
      kind: 'guided',
      id: 'check-your-state',
      name: 'Check your state',
      steps: [
        { title: 'Pause', instruction: 'Stop what you are doing. Take one ordinary breath.', seconds: 10 },
        { title: 'Body', instruction: 'Scan: heart rate, breath, chest, jaw, hands. Fast or slow? Tight or loose?', seconds: 25 },
        { title: 'Mind', instruction: 'Are your thoughts racing, looping, foggy, or fairly quiet?', seconds: 20 },
        {
          title: 'Choose',
          instruction: 'Given that, which technique fits? Pick one. There is no wrong answer — you can switch.',
          seconds: 20,
        },
      ],
    },
    solo: {
      prompt: 'Do the technique you chose, entirely on your own. No cues, no counting — just you.',
      seconds: 180,
    },
    whenToUse: 'Whenever you need it, wherever you are.',
  },
];

export function getModule(id: string): Module | undefined {
  return CURRICULUM.find((m) => m.id === id);
}

export function moduleIndex(id: string): number {
  return CURRICULUM.findIndex((m) => m.id === id);
}
