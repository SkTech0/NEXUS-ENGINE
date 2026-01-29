/**
 * Snapshot tests — validate that state/output snapshots are consistent.
 * Does not modify engine logic; uses ConsistencyEngine and snapshot records.
 */

import { ConsistencyEngine, InvariantEngine } from '../../src';

describe('Determinism / Snapshot', () => {
  describe('ConsistencyEngine', () => {
    it('validates pair equality', () => {
      const engine = new ConsistencyEngine<{ a: number }>();
      const result = engine.validatePair({
        a: { a: 1 },
        b: { a: 1 },
        label: 'snap',
      });
      expect(result.valid).toBe(true);
    });

    it('fails when pair differs', () => {
      const engine = new ConsistencyEngine<{ a: number }>();
      const result = engine.validatePair({
        a: { a: 1 },
        b: { a: 2 },
        label: 'snap',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('accepts custom equality', () => {
      const engine = new ConsistencyEngine<number>();
      engine.setEquality((a, b) => Math.abs(a - b) < 0.01);
      const result = engine.validatePair({ a: 1.0, b: 1.005 });
      expect(result.valid).toBe(true);
    });
  });

  describe('Snapshot invariants', () => {
    it('invariant engine validates snapshot shape', () => {
      const inv = new InvariantEngine<{ state: string }>();
      inv.add({
        name: 'hasState',
        check: (s) => typeof (s as { state?: string }).state === 'string',
      });
      const result = inv.validate({ state: 'ready' });
      expect(result.valid).toBe(true);
    });

    it('invariant engine fails on invalid shape', () => {
      const inv = new InvariantEngine<{ state: string }>();
      inv.add({
        name: 'hasState',
        check: (s) => typeof (s as { state?: string }).state === 'string',
      });
    const result = inv.validate({} as { state: string });
    expect(result.valid).toBe(false);
    });
  });
});
