/**
 * Benchmark runner — orchestrates engine, pipeline, AI, and IO benchmarks.
 * Produces before/after and measurable improvement.
 */

import type { BeforeAfterMetrics, PerfMetric } from '../types';
import { runEngineBench } from '../benchmarks/engine-bench';
import { runPipelineBench } from '../benchmarks/pipeline-bench';
import { runAiBench } from '../benchmarks/ai-bench';
import { runIoBench } from '../benchmarks/io-bench';

export interface BenchmarkRunnerResult {
  readonly engine: Awaited<ReturnType<typeof runEngineBench>>;
  readonly pipeline: Awaited<ReturnType<typeof runPipelineBench>>;
  readonly ai: Awaited<ReturnType<typeof runAiBench>>;
  readonly io: Awaited<ReturnType<typeof runIoBench>>;
  readonly aggregated: BeforeAfterMetrics;
}

export async function runAllBenchmarks(
  options: {
    engineOp?: () => Promise<void> | void;
    pipelineStages?: number;
    pipelineOp?: (stage: number) => Promise<void> | void;
    aiOp?: () => Promise<void> | void;
    ioOp?: () => Promise<void> | void;
  } = {}
): Promise<BenchmarkRunnerResult> {
  const noop = async (): Promise<void> => {};
  const engineOp = options.engineOp ?? noop;
  const pipelineStages = options.pipelineStages ?? 3;
  const pipelineOp = options.pipelineOp ?? (() => noop());
  const aiOp = options.aiOp ?? noop;
  const ioOp = options.ioOp ?? noop;

  const [engine, pipeline, ai, io] = await Promise.all([
    runEngineBench(engineOp, { runMs: 500, concurrency: 2 }),
    runPipelineBench(pipelineStages, pipelineOp, { iterations: 20 }),
    runAiBench(aiOp, { count: 30, concurrency: 2 }),
    runIoBench(ioOp, { count: 100 }),
  ]);

  const after: PerfMetric[] = [
    { name: 'bench.engine_throughput_ops_s', value: engine.throughput.opsPerSecond, unit: 'ops/s', timestamp: Date.now() },
    { name: 'bench.pipeline_throughput_ops_s', value: pipeline.throughput.opsPerSecond, unit: 'ops/s', timestamp: Date.now() },
    { name: 'bench.ai_throughput_ops_s', value: ai.throughput.opsPerSecond, unit: 'ops/s', timestamp: Date.now() },
    { name: 'bench.io_throughput_ops_s', value: io.throughput.opsPerSecond, unit: 'ops/s', timestamp: Date.now() },
  ];

  const aggregated: BeforeAfterMetrics = {
    before: [],
    after,
    improvement: {},
  };

  return {
    engine,
    pipeline,
    ai,
    io,
    aggregated,
  };
}
