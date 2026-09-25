import { describe, expect, it } from '@jest/globals';

import { CURRICULUM } from '../../content/curriculum';
import { SUPPORT_MODULES, SUPPORT_STATES, getAnyModule } from '../../content/support';
import { practiceSeconds } from '../timeline';

describe('support states', () => {
  it('every state resolves to a module', () => {
    for (const s of SUPPORT_STATES) {
      expect(getAnyModule(s.moduleId)).toBeDefined();
    }
  });

  it('support module ids never collide with curriculum ids', () => {
    const curriculumIds = new Set(CURRICULUM.map((m) => m.id));
    for (const m of SUPPORT_MODULES) {
      expect(curriculumIds.has(m.id)).toBe(false);
    }
  });

  it('support modules are not part of the curriculum', () => {
    const supportIds = new Set(SUPPORT_MODULES.map((m) => m.id));
    for (const m of CURRICULUM) {
      expect(supportIds.has(m.id)).toBe(false);
    }
  });

  it('each support module has a sane practice duration', () => {
    for (const m of SUPPORT_MODULES) {
      const seconds = practiceSeconds(m.practice);
      expect(seconds).toBeGreaterThanOrEqual(30);
      expect(seconds).toBeLessThanOrEqual(180);
    }
  });
});
