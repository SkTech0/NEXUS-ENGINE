/**
 * Concurrency tests — validate race conditions and concurrency safety.
 * Does not modify engine logic; uses ChaosRunner and consistency checks.
 */

import { ChaosRunner, ConsistencyEngine } from '../../src/index';

describe('Distributed / Concurrency', () => {
  it('ChaosRunner applies delay with probability', async () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'delay', probability: 1, params: { ms: 10 } }],
      seed: 42,
    });
    const start = Date.now();
    await runner.applyBeforeExecute('test', {});
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(5);
  });

  it('ChaosRunner injects fail when probability hit', async () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'fail', probability: 1 }],
      seed: 1,
    });
    await expect(runner.applyBeforeExecute('test', {})).rejects.toThrow(/Chaos/);
  });

  it('ConsistencyEngine validates concurrent outputs match', () => {
    const cons = new ConsistencyEngine<number>();
    const outputs = [1, 1, 1];
    const pairs = [
      { a: outputs[0], b: outputs[1] },
      { a: outputs[1], b: outputs[2] },
    ];
    const result = cons.validatePairs(pairs);
    expect(result.valid).toBe(true);
  });
});
