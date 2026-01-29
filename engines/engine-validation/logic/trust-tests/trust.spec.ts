/**
 * Trust tests — validate trust score and gate logic outputs.
 * Does not modify engine logic; uses validators only.
 */

import { InvariantEngine, DataValidator } from '../../src';

describe('Logic / Trust', () => {
  it('trust score in [0,1]', () => {
    const inv = new InvariantEngine<{ trustScore: number }>();
    inv.add({
      name: 'trustRange',
      check: (s) => s.trustScore >= 0 && s.trustScore <= 1,
    });
    expect(inv.validate({ trustScore: 0.7 }).valid).toBe(true);
    expect(inv.validate({ trustScore: 1.1 }).valid).toBe(false);
  });

  it('trust gate result has allowed/denied', () => {
    const inv = new InvariantEngine<{ allowed: boolean; reason?: string }>();
    inv.add({
      name: 'allowedBoolean',
      check: (s) => typeof s.allowed === 'boolean',
    });
    expect(inv.validate({ allowed: true }).valid).toBe(true);
  });

  it('data contract for trust payload', () => {
    const data = new DataValidator();
    data.addContract({
      name: 'hasTrustScore',
      check: (v) =>
        typeof v === 'object' && v !== null && 'trustScore' in v && typeof (v as { trustScore: unknown }).trustScore === 'number',
    });
    expect(data.validate({ trustScore: 0.8 }).valid).toBe(true);
  });
});
