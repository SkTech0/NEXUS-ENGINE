/**
 * Golden tests — validate output against known-good golden output.
 * Does not modify engine logic; compares actual vs golden.
 */

import { ConsistencyEngine } from '../../src';

const GOLDEN_OUTPUTS: Record<string, unknown> = {
  'input-1': { outcome: 'approve', confidence: 0.9 },
  'input-2': { outcome: 'refer', confidence: 0.6 },
};

describe('Determinism / Golden', () => {
  const engine = new ConsistencyEngine();

  it('matches golden for known input-1', () => {
    const actual = { outcome: 'approve', confidence: 0.9 };
    const golden = GOLDEN_OUTPUTS['input-1'];
    const result = engine.validatePair({ a: actual, b: golden, label: 'input-1' });
    expect(result.valid).toBe(true);
  });

  it('matches golden for known input-2', () => {
    const actual = { outcome: 'refer', confidence: 0.6 };
    const golden = GOLDEN_OUTPUTS['input-2'];
    const result = engine.validatePair({ a: actual, b: golden, label: 'input-2' });
    expect(result.valid).toBe(true);
  });

  it('fails when actual diverges from golden', () => {
    const actual = { outcome: 'deny', confidence: 0.5 };
    const golden = GOLDEN_OUTPUTS['input-1'];
    const result = engine.validatePair({ a: actual, b: golden, label: 'input-1' });
    expect(result.valid).toBe(false);
  });
});
