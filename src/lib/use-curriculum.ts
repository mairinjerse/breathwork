import { useMemo } from 'react';

import { CURRICULUM } from '../content/curriculum';
import { completedCount, currentModuleIndex, moduleStatuses } from './progress';
import { useAppState } from '../store/app-state';

/** Curriculum joined with the user's progress. */
export function useCurriculum() {
  const { state } = useAppState();
  return useMemo(() => {
    const statuses = moduleStatuses(
      CURRICULUM.map((m) => m.id),
      state.progress,
    );
    const current = currentModuleIndex(statuses);
    const completed = completedCount(statuses);
    return {
      modules: CURRICULUM,
      statuses,
      current,
      completed,
      total: CURRICULUM.length,
      graduated: current === -1,
    };
  }, [state.progress]);
}
