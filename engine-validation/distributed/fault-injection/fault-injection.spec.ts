/**
 * Fault injection tests — validate partial failure handling.
 * Does not modify engine logic; uses ChaosRunner with fail/drop.
 */

import { ChaosRunner } from '../../src';

describe('Distributed / Fault injection', () => {
  it('injected fail throws', async () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'fail', probability: 1, target: 'svc' }],
      seed: 1,
    });
    await expect(runner.applyBeforeExecute('svc', {})).rejects.toThrow();
  });

  it('target filter: fail only for matching target', async () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'fail', probability: 1, target: 'only-this' }],
      seed: 1,
    });
    await expect(runner.applyBeforeExecute('only-this', {})).rejects.toThrow();
    await expect(runner.applyBeforeExecute('other', {})).resolves.toBeUndefined();
  });

  it('probability 0 never triggers', async () => {
    const runner = new ChaosRunner({
      actions: [{ type: 'fail', probability: 0 }],
    });
    await expect(runner.applyBeforeExecute('test', {})).resolves.toBeUndefined();
  });
});
