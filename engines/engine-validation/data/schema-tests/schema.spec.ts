/**
 * Schema tests — validate schema correctness of inputs/outputs.
 * Does not modify engine logic; uses DataValidator.
 */

import { DataValidator } from '../../src';

describe('Data / Schema', () => {
  it('schema check passes for valid shape', () => {
    const data = new DataValidator();
    data.setSchemaCheck((v) => {
      const o = v as { outcome?: string };
      return typeof o === 'object' && o !== null && typeof o.outcome === 'string';
    });
    const result = data.validate({ outcome: 'approve' });
    expect(result.valid).toBe(true);
  });

  it('schema check fails for invalid shape', () => {
    const data = new DataValidator();
    data.setSchemaCheck((v) => typeof (v as { outcome?: string }).outcome === 'string');
    const result = data.validate({});
    expect(result.valid).toBe(false);
  });
});
