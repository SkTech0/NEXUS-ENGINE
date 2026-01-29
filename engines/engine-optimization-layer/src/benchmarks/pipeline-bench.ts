/**
 * Pipeline benchmark — pipeline and execution graph throughput/latency.
 * Produces measurable improvement proof.
 */

import type { PerfMetric, ThroughputSample } from '../types';

export interface PipelineBenchResult {
  readonly stagesCompleted: number;
  readonly totalMs: number;
  readonly throughput: ThroughputSample;
  readonly stageMetrics: PerfMetric[];
}

export async function runPipelineBench(
  stageCount: number,
  runPerStage: (stage: number) => Promise<void> | void,
  options: { iterations?: number } = {}
): Promise<PipelineBenchResult> {
  const iterations = options.iterations ?? 100;
  const stageMetrics: PerfMetric[] = [];
  const t0 = Date.now();
  let stagesCompleted = 0;

  for (let i = 0; i < iterations; i++) {
    for (let s = 0; s < stageCount; s++) {
      const start = performance.now();
      await runPerStage(s);
      stageMetrics.push({
        name: `pipeline.stage_${s}_ms`,
        value: performance.now() - start,
        unit: 'ms',
        timestamp: Date.now(),
      });
      stagesCompleted++;
    }
  }

  const totalMs = Date.now() - t0;
  const throughput: ThroughputSample = {
    opsPerSecond: (stagesCompleted / totalMs) * 1000,
    windowMs: totalMs,
    timestamp: Date.now(),
  };

  return {
    stagesCompleted,
    totalMs,
    throughput,
    stageMetrics,
  };
}
