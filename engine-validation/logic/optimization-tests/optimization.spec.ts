/**
 * Optimization tests — validate optimization outputs (constraints, objective values).
 * Does not modify engine logic; uses validators only.
 */

import { InvariantEngine, DataValidator } from '../../src';

describe('Logic / Optimization', () => {
  it('optimization result has valid structure', () => {
    const inv = new InvariantEngine<{ objectiveValue: number; feasible: boolean }>();
    inv
      .add({ name: 'objectiveNumber', check: (s) => typeof s.objectiveValue === 'number' })
      .add({ name: 'feasibleBoolean', check: (s) => typeof s.feasible === 'boolean' });
    const result = inv.validate({ objectiveValue: 0.8, feasible: true });
    expect(result.valid).toBe(true);
  });

  it('constraint slack non-negative when satisfied', () => {
    const inv = new InvariantEngine<{ slack: number; satisfied: boolean }>();
    inv.add({
      name: 'slackWhenSatisfied',
      check: (s) => !s.satisfied || s.slack >= 0,
    });
    expect(inv.validate({ slack: 0.1, satisfied: true }).valid).toBe(true);
    expect(inv.validate({ slack: -0.1, satisfied: true }).valid).toBe(false);
  });
});
