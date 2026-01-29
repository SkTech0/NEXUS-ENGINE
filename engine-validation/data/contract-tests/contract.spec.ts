/**
 * Contract tests — validate input/output contracts.
 * Does not modify engine logic; uses DataValidator contracts.
 */

import { DataValidator } from '../../src';

describe('Data / Contract', () => {
  it('contract passes when check returns true', () => {
    const data = new DataValidator();
    data.addContract({
      name: 'hasOutcome',
      check: (v) => typeof v === 'object' && v !== null && 'outcome' in (v as object),
    });
    const result = data.validate({ outcome: 'approve' });
    expect(result.valid).toBe(true);
  });

  it('contract fails when check returns false', () => {
    const data = new DataValidator();
    data.addContract({
      name: 'hasOutcome',
      check: (v) => typeof v === 'object' && v !== null && 'outcome' in (v as object),
    });
    const result = data.validate({});
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('hasOutcome'))).toBe(true);
  });

  it('validatePipeline checks input and output', () => {
    const data = new DataValidator();
    data.addContract({
      name: 'isObject',
      check: (v) => typeof v === 'object' && v !== null,
    });
    const result = data.validatePipeline({ x: 1 }, { outcome: 'approve' });
    expect(result.valid).toBe(true);
  });
});
