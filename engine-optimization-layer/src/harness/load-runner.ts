/**
 * Load runner — generates load and measures throughput/latency.
 * Additive; no change to engine semantics.
 */

import type { LatencySample, ThroughputSample, PerfMetric } from '../types';

export interface LoadRunnerConfig {
  readonly concurrency: number;
  readonly durationMs: number;
  readonly op: () => Promise<void> | void;
}

export interface LoadRunnerResult {
  readonly latency: LatencySample;
  readonly throughput: ThroughputSample;
  readonly metrics: PerfMetric[];
}

export async function runLoad(
  config: LoadRunnerConfig
): Promise<LoadRunnerResult> {
  const { concurrency, durationMs, op } = config;
  const latencies: number[] = [];
  const start = Date.now();
  const end = start + durationMs;

  const runOne = async (): Promise<void> => {
    while (Date.now() < end) {
      const t0 = performance.now();
      await op();
      latencies.push(performance.now() - t0);
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => runOne()));

  const windowMs = Date.now() - start;
  const sorted = latencies.slice().sort((a, b) => a - b);
  const p = (q: number) => sorted[Math.floor(sorted.length * q)] ?? 0;

  const latency: LatencySample = {
    p50: p(0.5),
    p95: p(0.95),
    p99: p(0.99),
    max: sorted[sorted.length - 1] ?? 0,
    count: sorted.length,
  };

  const throughput: ThroughputSample = {
    opsPerSecond: (latencies.length / windowMs) * 1000,
    windowMs,
    timestamp: Date.now(),
  };

  const metrics: PerfMetric[] = [
    { name: 'load_runner.latency_p99_ms', value: latency.p99, unit: 'ms', timestamp: Date.now() },
    { name: 'load_runner.throughput_ops_s', value: throughput.opsPerSecond, unit: 'ops/s', timestamp: Date.now() },
    { name: 'load_runner.total_ops', value: latencies.length, unit: 'count', timestamp: Date.now() },
  ];

  return { latency, throughput, metrics };
}
