/**
 * Replay tests — validate that same input produces same output (reproducibility).
 * Does not modify engine logic; uses DeterminismEngine and ReplayRunner.
 */

import { DeterminismEngine, ReplayRunner } from '../../src';
import type { EnginePort } from '../../../engine-core/src/index';

describe('Determinism / Replay', () => {
  describe('DeterminismEngine', () => {
    it('records runs and validates same-input same-output', () => {
      const engine = new DeterminismEngine();
      engine.record({
        traceId: 't1',
        input: { x: 1 },
        output: { y: 2 },
        timestamp: 1,
      });
      engine.record({
        traceId: 't2',
        input: { x: 1 },
        output: { y: 2 },
        timestamp: 2,
      });
      const result = engine.validateForInput({ x: 1 });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails when same input produces different output', () => {
      const engine = new DeterminismEngine();
      engine.record({
        traceId: 't1',
        input: { x: 1 },
        output: { y: 2 },
        timestamp: 1,
      });
      engine.record({
        traceId: 't2',
        input: { x: 1 },
        output: { y: 3 },
        timestamp: 2,
      });
      const result = engine.validateForInput({ x: 1 });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validateAll checks all recorded runs', () => {
      const engine = new DeterminismEngine();
      engine.record({ traceId: 'a', input: 1, output: 2, timestamp: 1 });
      engine.record({ traceId: 'b', input: 1, output: 2, timestamp: 2 });
      engine.record({ traceId: 'c', input: 2, output: 4, timestamp: 3 });
      const result = engine.validateAll();
      expect(result.valid).toBe(true);
    });
  });

  describe('ReplayRunner', () => {
    const stubEngine: EnginePort = {
      name: 'stub',
      execute: async (input: unknown) => {
        const n = (input as { x?: number }).x ?? 0;
        return { y: n * 2 };
      },
    };

    it('replays records and validates determinism', async () => {
      const runner = new ReplayRunner(stubEngine, { seed: 42 });
      runner.addRecord({
        traceId: 't1',
        input: { x: 5 },
        output: { y: 10 },
        timestamp: 1,
      });
      runner.addRecord({
        traceId: 't2',
        input: { x: 5 },
        output: { y: 10 },
        timestamp: 2,
      });
      const result = await runner.replayAll();
      expect(result.valid).toBe(true);
    });
  });
});
