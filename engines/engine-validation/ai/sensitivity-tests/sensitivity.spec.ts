/**
 * Sensitivity tests — validate sensitivity to input (small change → bounded output change).
 * Does not modify engine logic; uses ConsistencyEngine with tolerance.
 */

import { ConsistencyEngine } from '../../src';

describe('AI / Sensitivity', () => {
  it('small input change within tolerance', () => {
    const engine = new ConsistencyEngine<number>();
    engine.setEquality((a, b) => Math.abs(a - b) < 0.1);
    const result = engine.validatePair({ a: 0.5, b: 0.52 });
    expect(result.valid).toBe(true);
  });

  it('large input change can exceed tolerance', () => {
    const engine = new ConsistencyEngine<number>();
    engine.setEquality((a, b) => Math.abs(a - b) < 0.1);
    const result = engine.validatePair({ a: 0.5, b: 0.9 });
    expect(result.valid).toBe(false);
  });
});
