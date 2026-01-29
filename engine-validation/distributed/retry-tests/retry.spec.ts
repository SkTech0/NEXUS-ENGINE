/**
 * Retry tests — validate retry correctness (idempotency, consistency).
 * Does not modify engine logic; uses DeterminismEngine to assert same output on retry.
 */

import { DeterminismEngine } from '../../src';

describe('Distributed / Retry', () => {
  it('same input produces same output (idempotency)', () => {
    const engine = new DeterminismEngine();
    for (let i = 0; i < 3; i++) {
      engine.record({
        traceId: `retry-${i}`,
        input: { id: 'req-1' },
        output: { result: 'ok' },
        timestamp: Date.now() + i,
      });
    }
    const result = engine.validateForInput({ id: 'req-1' });
    expect(result.valid).toBe(true);
  });

  it('detects non-idempotent output on retry', () => {
    const engine = new DeterminismEngine();
    engine.record({
      traceId: 'r1',
      input: { id: 'req-1' },
      output: { result: 'ok' },
      timestamp: 1,
    });
    engine.record({
      traceId: 'r2',
      input: { id: 'req-1' },
      output: { result: 'different' },
      timestamp: 2,
    });
    const result = engine.validateForInput({ id: 'req-1' });
    expect(result.valid).toBe(false);
  });
});
