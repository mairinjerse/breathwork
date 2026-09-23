/**
 * Pure progress logic: module states, check-in cadence and summaries.
 * No React, no storage — everything here is unit-tested.
 */

export type Guidance = 'guided' | 'solo';

export type SessionRecord = {
  id: string;
  practiceId: string;
  moduleId?: string;
  guidance: Guidance;
  /** ISO timestamp. */
  startedAt: string;
  seconds: number;
  completed: boolean;
  /** Self-reported activation before/after, 1 (calm) – 5 (very activated). */
  before?: number;
  after?: number;
  /** Set when the session was launched from in-the-moment support, e.g. 'panic'. */
  supportId?: string;
};

export type ModuleProgress = {
  /** ISO timestamps of when each step was done. */
  understood?: string;
  guided?: string;
  solo?: string;
  completedAt?: string;
};

export type CheckIn = {
  id: string;
  at: string;
  /** 1 = hardly stressed … 5 = very stressed */
  stress: number;
  /** 1 = settle slowly … 5 = settle quickly */
  recovery: number;
  /** 1 = not confident … 5 = very confident I can calm myself without help */
  selfReliance: number;
};

/** A time the user used a technique without opening a session in the app. */
export type OwnUse = { id: string; at: string; moduleId?: string };

export type ModuleStatus = 'complete' | 'in-progress' | 'up-next' | 'locked';

export const MODULE_STEPS = ['understood', 'guided', 'solo'] as const;
export type ModuleStep = (typeof MODULE_STEPS)[number];

export function stepsDone(p: ModuleProgress | undefined): number {
  if (!p) return 0;
  return MODULE_STEPS.filter((s) => !!p[s]).length;
}

export function isModuleComplete(p: ModuleProgress | undefined): boolean {
  return stepsDone(p) === MODULE_STEPS.length;
}

/**
 * Modules unlock in order: each one opens when the previous is complete.
 * The curriculum is a sequence with an end, not a menu.
 */
export function moduleStatuses(
  moduleIds: string[],
  progress: Record<string, ModuleProgress | undefined>,
): ModuleStatus[] {
  let previousComplete = true;
  return moduleIds.map((id) => {
    const p = progress[id];
    let status: ModuleStatus;
    if (!previousComplete) status = 'locked';
    else if (isModuleComplete(p)) status = 'complete';
    else if (stepsDone(p) > 0) status = 'in-progress';
    else status = 'up-next';
    previousComplete = status === 'complete';
    return status;
  });
}

/** Index of the module to continue, or -1 when the curriculum is finished. */
export function currentModuleIndex(statuses: ModuleStatus[]): number {
  return statuses.findIndex((s) => s === 'in-progress' || s === 'up-next');
}

export function completedCount(statuses: ModuleStatus[]): number {
  return statuses.filter((s) => s === 'complete').length;
}

/**
 * Check-ins taper as you advance: weekly while learning the basics,
 * fortnightly through the rest, monthly once you've finished.
 */
export function checkInIntervalDays(completed: number, total: number): number {
  if (completed >= total) return 30;
  if (completed < 4) return 7;
  return 14;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function nextCheckInDate(
  checkIns: CheckIn[],
  completed: number,
  total: number,
): Date | null {
  if (checkIns.length === 0) return null; // due now: no baseline yet
  const last = latest(checkIns);
  return new Date(Date.parse(last.at) + checkInIntervalDays(completed, total) * DAY_MS);
}

export function isCheckInDue(
  checkIns: CheckIn[],
  completed: number,
  total: number,
  now: Date = new Date(),
): boolean {
  const next = nextCheckInDate(checkIns, completed, total);
  return next === null || next.getTime() <= now.getTime();
}

export function latest<T extends { at: string }>(items: T[]): T {
  return items.reduce((a, b) => (Date.parse(b.at) > Date.parse(a.at) ? b : a));
}

export function sortByDate<T extends { at: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export type SessionShift = { count: number; before: number; after: number };

/** Average self-reported activation before vs. after, for sessions that have both. */
export function sessionShift(sessions: SessionRecord[]): SessionShift | null {
  const rated = sessions.filter(
    (s) => s.completed && s.before !== undefined && s.after !== undefined,
  );
  if (rated.length === 0) return null;
  const before = rated.reduce((sum, s) => sum + (s.before as number), 0) / rated.length;
  const after = rated.reduce((sum, s) => sum + (s.after as number), 0) / rated.length;
  return { count: rated.length, before, after };
}

export type RelianceWindow = { label: string; inApp: number; onOwn: number };

/**
 * In-app sessions vs. times used on your own, per calendar month (oldest first).
 * The hoped-for direction is the second number growing relative to the first.
 */
export function relianceByMonth(
  sessions: SessionRecord[],
  ownUses: OwnUse[],
  months = 4,
  now: Date = new Date(),
): RelianceWindow[] {
  const windows: RelianceWindow[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const inRange = (iso: string) => {
      const t = Date.parse(iso);
      return t >= start.getTime() && t < end.getTime();
    };
    windows.push({
      label: start.toLocaleString('en', { month: 'short' }),
      inApp: sessions.filter((s) => s.completed && inRange(s.startedAt)).length,
      onOwn: ownUses.filter((u) => inRange(u.at)).length,
    });
  }
  return windows;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
