/**
 * Invariant tests — validate that engine state and outputs satisfy declared invariants.
 * Does not modify engine logic.
 */

import { InvariantEngine } from '../../src';

describe('Logic / Invariants', () => {
  interface DecisionState {
    outcome: string;
    confidence: number;
  }

  it('passes when all invariants hold', () => {
    const engine = new InvariantEngine<DecisionState>();
    engine
      .add({
        name: 'outcomeKnown',
        check: (s) => ['approve', 'deny', 'refer', 'defer'].includes(s.outcome),
      })
      .add({
        name: 'confidenceInRange',
        check: (s) => s.confidence >= 0 && s.confidence <= 1,
      });
    const result = engine.validate({ outcome: 'approve', confidence: 0.9 });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when invariant violated', () => {
    const engine = new InvariantEngine<DecisionState>();
    engine.add({
      name: 'confidenceInRange',
      check: (s) => s.confidence >= 0 && s.confidence <= 1,
    });
    const result = engine.validate({ outcome: 'approve', confidence: 1.5 });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('supports add/remove invariants', () => {
    const engine = new InvariantEngine<DecisionState>();
    engine.add({ name: 'a', check: () => true }).add({ name: 'b', check: () => true });
    expect(engine.getInvariantNames()).toContain('a');
    engine.remove('a');
    expect(engine.getInvariantNames()).not.toContain('a');
  });
});
