/**
 * Drift tests — validate output consistency over time (drift detection).
 * Does not modify engine logic; uses ConsistencyEngine to compare baseline vs current.
 */

import { ConsistencyEngine } from '../../src';

describe('AI / Drift', () => {
  it('baseline and current output match (no drift)', () => {
    const engine = new ConsistencyEngine<{ score: number }>();
    const baseline = { score: 0.75 };
    const current = { score: 0.75 };
    const result = engine.validatePair({ a: baseline, b: current, label: 'drift' });
    expect(result.valid).toBe(true);
  });

  it('detects drift when current differs from baseline', () => {
    const engine = new ConsistencyEngine<{ score: number }>();
    const baseline = { score: 0.75 };
    const current = { score: 0.95 };
    const result = engine.validatePair({ a: baseline, b: current, label: 'drift' });
    expect(result.valid).toBe(false);
  });

  it('custom equality for tolerance', () => {
    const engine = new ConsistencyEngine<{ score: number }>();
    engine.setEquality((a, b) => Math.abs(a.score - b.score) < 0.05);
    const result = engine.validatePair({
      a: { score: 0.75 },
      b: { score: 0.78 },
    });
    expect(result.valid).toBe(true);
  });
});
