import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';

import {
  newId,
  type CheckIn,
  type ModuleProgress,
  type ModuleStep,
  type OwnUse,
  type SessionRecord,
} from '../lib/progress';
import type { ThemeName } from '../theme/tokens';

/**
 * Local-first app state. Everything lives on the device in one AsyncStorage
 * key; there is no backend in v1. Bump STATE_VERSION and add a migration in
 * `hydrate` when the shape changes.
 */

const STORAGE_KEY = 'exhale.state';
const STATE_VERSION = 1;

export type Settings = {
  name: string;
  theme: ThemeName;
  haptics: boolean;
  /** Ask "how activated do you feel?" before and after sessions. */
  sessionRatings: boolean;
};

export type AppState = {
  version: number;
  onboarded: boolean;
  settings: Settings;
  progress: Record<string, ModuleProgress>;
  sessions: SessionRecord[];
  checkIns: CheckIn[];
  ownUses: OwnUse[];
};

export const initialState: AppState = {
  version: STATE_VERSION,
  onboarded: false,
  settings: { name: '', theme: 'day', haptics: true, sessionRatings: true },
  progress: {},
  sessions: [],
  checkIns: [],
  ownUses: [],
};

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'finishOnboarding' }
  | { type: 'updateSettings'; settings: Partial<Settings> }
  | { type: 'completeStep'; moduleId: string; step: ModuleStep }
  | { type: 'addSession'; session: SessionRecord }
  | { type: 'addCheckIn'; checkIn: CheckIn }
  | { type: 'addOwnUse'; use: OwnUse }
  | { type: 'reset' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'finishOnboarding':
      return { ...state, onboarded: true };
    case 'updateSettings':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'completeStep': {
      const prev = state.progress[action.moduleId] ?? {};
      if (prev[action.step]) return state;
      const now = new Date().toISOString();
      const next: ModuleProgress = { ...prev, [action.step]: now };
      if (next.understood && next.guided && next.solo && !next.completedAt) next.completedAt = now;
      return { ...state, progress: { ...state.progress, [action.moduleId]: next } };
    }
    case 'addSession':
      return { ...state, sessions: [...state.sessions, action.session] };
    case 'addCheckIn':
      return { ...state, checkIns: [...state.checkIns, action.checkIn] };
    case 'addOwnUse':
      return { ...state, ownUses: [...state.ownUses, action.use] };
    case 'reset':
      return { ...initialState };
  }
}

function hydrate(raw: string | null): AppState {
  if (!raw) return initialState;
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      settings: { ...initialState.settings, ...parsed.settings },
      version: STATE_VERSION,
    };
  } catch {
    return initialState;
  }
}

type Actions = {
  finishOnboarding(): void;
  updateSettings(settings: Partial<Settings>): void;
  completeStep(moduleId: string, step: ModuleStep): void;
  addSession(session: Omit<SessionRecord, 'id'>): void;
  addCheckIn(answers: Omit<CheckIn, 'id' | 'at'>): void;
  addOwnUse(moduleId?: string): void;
  reset(): void;
};

type ContextValue = { state: AppState; ready: boolean; actions: Actions };

const AppStateContext = createContext<ContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => dispatch({ type: 'hydrate', state: hydrate(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const actions = useMemo<Actions>(
    () => ({
      finishOnboarding: () => dispatch({ type: 'finishOnboarding' }),
      updateSettings: (settings) => dispatch({ type: 'updateSettings', settings }),
      completeStep: (moduleId, step) => dispatch({ type: 'completeStep', moduleId, step }),
      addSession: (session) => dispatch({ type: 'addSession', session: { ...session, id: newId() } }),
      addCheckIn: (answers) =>
        dispatch({
          type: 'addCheckIn',
          checkIn: { ...answers, id: newId(), at: new Date().toISOString() },
        }),
      addOwnUse: (moduleId) =>
        dispatch({ type: 'addOwnUse', use: { id: newId(), at: new Date().toISOString(), moduleId } }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  const value = useMemo(() => ({ state, ready, actions }), [state, ready, actions]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): ContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
