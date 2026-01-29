/**
 * Chaos tests — validate behavior under injected failures and delays.
 * Does not modify engine logic; uses ChaosRunner only.
 */

import { ChaosRunner } from '../../src';

describe('Distributed / Chaos', () => {
  it('shouldDrop returns true when drop probability hit', () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'drop', probability: 1 }],
      seed: 12345,
    });
    expect(runner.shouldDrop('test')).toBe(true);
  });

  it('shouldFail returns true when fail probability hit', () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'fail', probability: 1 }],
      seed: 999,
    });
    expect(runner.shouldFail('test')).toBe(true);
  });

  it('deterministic seed produces same drop/fail behavior', () => {
    const r1 = new ChaosRunner({ actions: [{ type: 'drop', probability: 0.5 }], seed: 42 });
    const r2 = new ChaosRunner({ actions: [{ type: 'drop', probability: 0.5 }], seed: 42 });
    const d1 = r1.shouldDrop('t');
    const d2 = r2.shouldDrop('t');
    expect(d1).toBe(d2);
  });
});
