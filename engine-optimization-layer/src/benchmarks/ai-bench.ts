/**
 * AI benchmark — inference pool, batching, and vector cache performance.
 * Produces measurable improvement proof.
 */

import type { PerfMetric, ThroughputSample } from '../types';

export interface AiBenchResult {
  readonly inferenceCount: number;
  readonly totalMs: number;
  readonly throughput: ThroughputSample;
  readonly metrics: PerfMetric[];
}

export async function runAiBench(
  inferenceOp: () => Promise<void> | void,
  options: { count?: number; concurrency?: number } = {}
): Promise<AiBenchResult> {
  const count = options.count ?? 50;
  const concurrency = options.concurrency ?? 4;
  const metrics: PerfMetric[] = [];
  const t0 = Date.now();
  let done = 0;
  const run = async (): Promise<void> => {
    while (done < count) {
      const i = done++;
      if (i >= count) break;
      const start = performance.now();
      await inferenceOp();
      metrics.push({
        name: 'ai_bench.inference_ms',
        value: performance.now() - start,
        unit: 'ms',
        timestamp: Date.now(),
      });
    }
  };
  await Promise.all(Array.from({ length: concurrency }, () => run()));
  const totalMs = Date.now() - t0;
  const throughput: ThroughputSample = {
    opsPerSecond: (count / totalMs) * 1000,
    windowMs: totalMs,
    timestamp: Date.now(),
  };
  return {
    inferenceCount: count,
    totalMs,
    throughput,
    metrics,
  };
}
