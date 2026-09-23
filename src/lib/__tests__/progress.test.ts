import { describe, expect, it } from '@jest/globals';

import {
  checkInIntervalDays,
  currentModuleIndex,
  isCheckInDue,
  moduleStatuses,
  relianceByMonth,
  sessionShift,
  type CheckIn,
  type SessionRecord,
} from '../progress';

const done = { understood: 'x', guided: 'x', solo: 'x' };

describe('moduleStatuses', () => {
  const ids = ['a', 'b', 'c', 'd'];

  it('opens only the first module for a new user', () => {
    expect(moduleStatuses(ids, {})).toEqual(['up-next', 'locked', 'locked', 'locked']);
  });

  it('marks partial progress as in progress and unlocks in order', () => {
    const s = moduleStatuses(ids, { a: done, b: { understood: 'x' } });
    expect(s).toEqual(['complete', 'in-progress', 'locked', 'locked']);
    expect(currentModuleIndex(s)).toBe(1);
  });

  it('keeps later modules locked even if they have stray progress', () => {
    expect(moduleStatuses(ids, { c: done })).toEqual(['up-next', 'locked', 'locked', 'locked']);
  });

  it('reports the end of the curriculum', () => {
    const s = moduleStatuses(ids, { a: done, b: done, c: done, d: done });
    expect(currentModuleIndex(s)).toBe(-1);
  });
});

describe('check-in cadence', () => {
  it('tapers as the user advances', () => {
    expect(checkInIntervalDays(0, 11)).toBe(7);
    expect(checkInIntervalDays(5, 11)).toBe(14);
    expect(checkInIntervalDays(11, 11)).toBe(30);
  });

  const at = (iso: string): CheckIn => ({ id: iso, at: iso, stress: 3, recovery: 3, selfReliance: 3 });

  it('is due when there is no baseline', () => {
    expect(isCheckInDue([], 0, 11)).toBe(true);
  });

  it('uses the latest check-in and the current interval', () => {
    const checkIns = [at('2026-01-01T00:00:00Z'), at('2026-01-10T00:00:00Z')];
    expect(isCheckInDue(checkIns, 0, 11, new Date('2026-01-16T00:00:00Z'))).toBe(false);
    expect(isCheckInDue(checkIns, 0, 11, new Date('2026-01-17T00:00:00Z'))).toBe(true);
    expect(isCheckInDue(checkIns, 11, 11, new Date('2026-01-17T00:00:00Z'))).toBe(false);
  });
});

describe('sessionShift', () => {
  const s = (over: Partial<SessionRecord>): SessionRecord => ({
    id: 'x',
    practiceId: 'p',
    guidance: 'guided',
    startedAt: '2026-01-01T00:00:00Z',
    seconds: 60,
    completed: true,
    ...over,
  });

  it('averages only completed sessions rated both before and after', () => {
    const shift = sessionShift([
      s({ before: 4, after: 2 }),
      s({ before: 5, after: 2 }),
      s({ before: 3 }),
      s({ before: 5, after: 5, completed: false }),
    ]);
    expect(shift).toEqual({ count: 2, before: 4.5, after: 2 });
  });

  it('returns null with nothing rated', () => {
    expect(sessionShift([s({})])).toBeNull();
  });
});

describe('relianceByMonth', () => {
  it('buckets in-app and on-your-own use by month', () => {
    const now = new Date(2026, 2, 15);
    const sessions: SessionRecord[] = [
      { id: '1', practiceId: 'p', guidance: 'guided', startedAt: new Date(2026, 1, 3).toISOString(), seconds: 60, completed: true },
      { id: '2', practiceId: 'p', guidance: 'guided', startedAt: new Date(2026, 2, 3).toISOString(), seconds: 60, completed: true },
      { id: '3', practiceId: 'p', guidance: 'guided', startedAt: new Date(2026, 2, 4).toISOString(), seconds: 60, completed: false },
    ];
    const own = [{ id: 'o', at: new Date(2026, 2, 10).toISOString() }];
    const w = relianceByMonth(sessions, own, 2, now);
    expect(w.map((x) => [x.inApp, x.onOwn])).toEqual([
      [1, 0],
      [1, 1],
    ]);
  });
});
