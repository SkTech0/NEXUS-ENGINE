/**
 * Decision tests — validate decision logic outputs (outcome, confidence).
 * Does not modify engine logic; uses validators only.
 */

import { InvariantEngine, ConsistencyEngine } from '../../src';

describe('Logic / Decision', () => {
  it('decision result has outcome and confidence', () => {
    const inv = new InvariantEngine<{ outcome: string; confidence: number }>();
    inv
      .add({ name: 'outcome', check: (s) => typeof s.outcome === 'string' })
      .add({ name: 'confidence', check: (s) => typeof s.confidence === 'number' && s.confidence >= 0 && s.confidence <= 1 });
    const result = inv.validate({ outcome: 'approve', confidence: 0.85 });
    expect(result.valid).toBe(true);
  });

  it('two identical decision results are consistent', () => {
    const cons = new ConsistencyEngine<{ outcome: string; confidence: number }>();
    const a = { outcome: 'refer', confidence: 0.6 };
    const b = { outcome: 'refer', confidence: 0.6 };
    const result = cons.validatePair({ a, b, label: 'decision' });
    expect(result.valid).toBe(true);
  });
});
