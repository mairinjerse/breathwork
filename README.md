# Exhale

A breathwork and nervous-system-regulation app that teaches the physiology well enough that you need it less over time. Secular, evidence-based, mastery model rather than habit loop.

Built with Expo (SDK 57), Expo Router and TypeScript. It runs on iOS, Android and web from one codebase. All data is local-first (AsyncStorage) and there is no backend in v1.

## Running it

```bash
npm install
npx expo start          # then press i / a / w, or scan the QR code with Expo Go
npm test                # unit tests (jest-expo)
npm run typecheck       # tsc --noEmit
npm run lint            # eslint (expo config)
```

Use `npx expo install <pkg>` to add dependencies so you get SDK-compatible versions. `AGENTS.md` has Expo-specific notes for AI pair-coding sessions.

## Structure

```
src/
  app/                    Expo Router routes (every file here is a screen)
    _layout.tsx           fonts, providers, onboarding guard
    onboarding.tsx        welcome → try 3 sighs → how it works
    (tabs)/               Home, Curriculum, Progress, Profile
    module/[id].tsx       curriculum detail: what / why / guided / on your own / complete
    session/[id].tsx      the practice screen (blob, phase cues, before/after rating)
    check-in.tsx          periodic 3-question self-report
  content/
    curriculum.ts         all 11 modules: copy, mechanism, evidence, practice definitions
    check-in.ts           the check-in questions
    types.ts
  lib/
    timeline.ts           pure breath/step timing engine (tested)
    progress.ts           module states, unlock order, check-in taper, summaries (tested)
  store/app-state.tsx     local-first state + persistence
  theme/tokens.ts         exact design-system tokens
  components/             Blob, UI primitives, charts, module row
```

## How it maps to the brief

**Mastery, not habit loop.** There are 11 sequential modules in three parts: Breath, Beyond the breath, and On your own. Each has three steps: understand the mechanism, practise with guidance, practise on your own with no pacing and only a timer. A module unlocks when the previous one is complete. Finishing the last module shows a "You're equipped" end state. After that, Home switches to a toolkit of the techniques you've learned.

**No streak mechanics.** There are no streaks, no notifications and no calendar grids. The only recurring prompt is the check-in, and it tapers as you advance: weekly for the first 4 modules, then fortnightly, then monthly once you've finished (`checkInIntervalDays` in `lib/progress.ts`). It appears as a quiet card on Home and never as a push.

**Seeing whether it works (v1, not an afterthought):**
- An optional 1–5 activation rating before and after every session. Progress shows the average shift and the recent before/after pairs.
- A periodic 3-question check-in covering general stress, how quickly you settle, and confidence that you can calm yourself without help. It is plotted per check-in, not per day, so gaps never read as failure.
- "Needing it less": sessions in the app next to times you logged using a technique on your own. The second number growing is the goal the app shows.

**Physiology-first.** Every module has a plain-language "Why it works" and an evidence note that is honest about its strength (strong / moderate / emerging). The body-based modules avoid the word "somatic".

**Visual identity.** The tokens in `theme/tokens.ts` are copied exactly from the Exhale design system (tokens.json v4). Day is the default and Night is optional in Profile. The gradient blob (`components/blob.tsx`) is layered SVG radial gradients with a soft radial mask, mirroring the canvas reference. It appears as the app icon, as small accents on cards and markers, and at full size on the practice screen. There it scales with the breath and drifts slowly, using the canvas's own `drift` values, and the drift is disabled when Reduce Motion is on. Motion appears only on the practice screen. The functional `accent` is used only for links, selected states and progress fills. Display type is STIX Two Text and body type is IBM Plex Sans, loaded via `@expo-google-fonts`.

The app icon, adaptive icon, splash and favicon in `assets/images` were rendered from the canvas `Icon.dc.html` reference.

## Open items

- **Progress screen needs its dedicated design pass.** The current screen is a working first pass that follows the rules noted at the top of `(tabs)/progress.tsx`. The visual treatment of change over time is still the open taste decision the brief calls out.
- **Onboarding, curriculum detail and settings** were built directly from the design system without mocks, so they're worth a look on the canvas.
- **Curriculum copy** should be reviewed against the brand brief's voice, and the evidence notes checked by someone with a clinical or research background before launch.
- **No audio.** Sessions are paced by the visual plus haptics. Voice or tone cues would be a natural addition.
- **Data export** uses the system share sheet (JSON). There is no import or sync, by design for v1.
- **State migrations**: bump `STATE_VERSION` in `store/app-state.tsx` and migrate in `hydrate` when the stored shape changes.
