/**
 * AI regression tests — validate model/output stability.
 * Does not modify engine or model logic; uses ConsistencyEngine and DeterminismEngine.
 */

import { ConsistencyEngine, DeterminismEngine } from '../../src';

describe('AI / Regression', () => {
  it('same input produces same model output (stability)', () => {
    const engine = new DeterminismEngine();
    engine.record({
      traceId: 'm1',
      input: { features: [1, 2, 3] },
      output: { score: 0.85, label: 'approve' },
      timestamp: 1,
    });
    engine.record({
      traceId: 'm2',
      input: { features: [1, 2, 3] },
      output: { score: 0.85, label: 'approve' },
      timestamp: 2,
    });
    const result = engine.validateForInput({ features: [1, 2, 3] });
    expect(result.valid).toBe(true);
  });

  it('output structure has score and label', () => {
    const cons = new ConsistencyEngine<{ score: number; label: string }>();
    cons.setEquality((a, b) => a.score === b.score && a.label === b.label);
    const result = cons.validatePair({
      a: { score: 0.8, label: 'approve' },
      b: { score: 0.8, label: 'approve' },
    });
    expect(result.valid).toBe(true);
  });
});
