/**
 * Stress runner — stress test with increasing load until saturation or failure.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface StressRunnerConfig {
  readonly op: () => Promise<void> | void;
  readonly minConcurrency: number;
  readonly maxConcurrency: number;
  readonly step: number;
  readonly durationPerStepMs: number;
}

export interface StressStepResult {
  readonly concurrency: number;
  readonly completed: number;
  readonly failed: number;
  readonly avgLatencyMs: number;
  readonly opsPerSecond: number;
}

export interface StressRunnerResult {
  readonly steps: StressStepResult[];
  readonly metrics: PerfMetric[];
}

export async function runStress(config: StressRunnerConfig): Promise<StressRunnerResult> {
  const { op, minConcurrency, maxConcurrency, step, durationPerStepMs } = config;
  const steps: StressStepResult[] = [];
  let failed = 0;

  for (let c = minConcurrency; c <= maxConcurrency; c += step) {
    const latencies: number[] = [];
    const end = Date.now() + durationPerStepMs;

    const runOne = async (): Promise<void> => {
      while (Date.now() < end) {
        try {
          const t0 = performance.now();
          await op();
          latencies.push(performance.now() - t0);
        } catch {
          failed++;
        }
      }
    };

    await Promise.all(Array.from({ length: c }, () => runOne()));

    const totalMs = durationPerStepMs;
    const completed = latencies.length;
    const avgMs = completed === 0 ? 0 : latencies.reduce((a, b) => a + b, 0) / completed;
    const opsPerSecond = (completed / totalMs) * 1000;

    steps.push({
      concurrency: c,
      completed,
      failed,
      avgLatencyMs: avgMs,
      opsPerSecond,
    });
  }

  const metrics: PerfMetric[] = [
    { name: 'stress_runner.steps', value: steps.length, unit: 'count', timestamp: Date.now() },
    { name: 'stress_runner.total_failed', value: failed, unit: 'count', timestamp: Date.now() },
  ];

  return { steps, metrics };
}
