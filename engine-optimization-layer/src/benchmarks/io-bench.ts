/**
 * IO benchmark — buffer pool, stream, and storage layer performance.
 * Produces measurable improvement proof.
 */

import type { PerfMetric, ThroughputSample } from '../types';

export interface IoBenchResult {
  readonly opCount: number;
  readonly totalMs: number;
  readonly throughput: ThroughputSample;
  readonly metrics: PerfMetric[];
}

export async function runIoBench(
  ioOp: () => Promise<void> | void,
  options: { count?: number } = {}
): Promise<IoBenchResult> {
  const count = options.count ?? 200;
  const metrics: PerfMetric[] = [];
  const t0 = Date.now();
  for (let i = 0; i < count; i++) {
    const start = performance.now();
    await ioOp();
    metrics.push({
      name: 'io_bench.op_ms',
      value: performance.now() - start,
      unit: 'ms',
      timestamp: Date.now(),
    });
  }
  const totalMs = Date.now() - t0;
  const throughput: ThroughputSample = {
    opsPerSecond: (count / totalMs) * 1000,
    windowMs: totalMs,
    timestamp: Date.now(),
  };
  return {
    opCount: count,
    totalMs,
    throughput,
    metrics,
  };
}
