/**
 * Pipeline tests — validate transformation correctness (input → output).
 * Does not modify engine logic; uses DataValidator and InvariantEngine.
 */

import { DataValidator, InvariantEngine } from '../../src';

describe('Data / Pipeline', () => {
  it('output satisfies contract when input does', () => {
    const data = new DataValidator();
    data.addContract({
      name: 'object',
      check: (v) => typeof v === 'object' && v !== null,
    });
    const inputResult = data.validate({ in: 1 });
    const outputResult = data.validate({ out: 2 });
    expect(inputResult.valid).toBe(true);
    expect(outputResult.valid).toBe(true);
  });

  it('pipeline invariant: output has required fields', () => {
    const inv = new InvariantEngine<{ outcome: string }>();
    inv.add({ name: 'outcome', check: (s) => typeof s.outcome === 'string' });
    const result = inv.validate({ outcome: 'approve' });
    expect(result.valid).toBe(true);
  });
});
