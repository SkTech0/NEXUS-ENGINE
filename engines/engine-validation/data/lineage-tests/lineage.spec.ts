/**
 * Lineage tests — validate traceId/ref propagation (lineage correctness).
 * Does not modify engine logic; uses invariants on traceId presence.
 */

import { InvariantEngine } from '../../src';

describe('Data / Lineage', () => {
  it('record has traceId when required', () => {
    const inv = new InvariantEngine<{ traceId?: string }>();
    inv.add({
      name: 'hasTraceId',
      check: (s) => typeof s.traceId === 'string' && s.traceId.length > 0,
    });
    expect(inv.validate({ traceId: 't-123' }).valid).toBe(true);
    expect(inv.validate({}).valid).toBe(false);
  });

  it('record has ref when required', () => {
    const inv = new InvariantEngine<{ ref?: string }>();
    inv.add({
      name: 'hasRef',
      check: (s) => typeof s.ref === 'string',
    });
    expect(inv.validate({ ref: 'artifact-1' }).valid).toBe(true);
  });
});
