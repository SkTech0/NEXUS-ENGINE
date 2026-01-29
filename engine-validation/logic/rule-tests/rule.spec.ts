/**
 * Rule validation tests — validate decision rules, optimization rules, fallback logic.
 * Does not modify engine logic; asserts on outputs.
 */

import { InvariantEngine, DataValidator } from '../../src';

describe('Logic / Rule', () => {
  it('decision outcome is one of allowed values', () => {
    const inv = new InvariantEngine<{ outcome: string }>();
    inv.add({
      name: 'allowedOutcome',
      check: (s) => ['approve', 'deny', 'refer', 'defer'].includes(s.outcome),
    });
    expect(inv.validate({ outcome: 'approve' }).valid).toBe(true);
    expect(inv.validate({ outcome: 'invalid' }).valid).toBe(false);
  });

  it('confidence in [0,1]', () => {
    const inv = new InvariantEngine<{ confidence: number }>();
    inv.add({
      name: 'confidenceRange',
      check: (s) => s.confidence >= 0 && s.confidence <= 1,
    });
    expect(inv.validate({ confidence: 0.5 }).valid).toBe(true);
    expect(inv.validate({ confidence: -0.1 }).valid).toBe(false);
  });

  it('data contract: required fields present', () => {
    const data = new DataValidator();
    data.addContract({
      name: 'hasOutcome',
      check: (v) =>
        typeof v === 'object' && v !== null && 'outcome' in v && typeof (v as { outcome: unknown }).outcome === 'string',
    });
    expect(data.validate({ outcome: 'approve' }).valid).toBe(true);
    expect(data.validate({}).valid).toBe(false);
  });
});
