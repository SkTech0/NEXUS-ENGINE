/**
 * Pipeline optimizer — batches and reorders pipeline stages for throughput.
 * Additive wrapper; does not change stage semantics.
 */

import type { PerfMetric } from '../types';

export interface PipelineStage {
  readonly id: string;
  readonly run: () => Promise<void>;
}

export interface PipelineOptimizerConfig {
  readonly batchStages: boolean;
  readonly maxBatchSize: number;
}

export class PipelineOptimizer {
  private readonly config: PipelineOptimizerConfig;
  private readonly stageLatencyMs: Map<string, number[]> = new Map();
  private readonly runCount: Map<string, number> = new Map();

  constructor(config: Partial<PipelineOptimizerConfig> = {}) {
    this.config = {
      batchStages: config.batchStages ?? true,
      maxBatchSize: config.maxBatchSize ?? 8,
    };
  }

  async runStage(stage: PipelineStage): Promise<void> {
    const start = Date.now();
    try {
      await stage.run();
    } finally {
      const elapsed = Date.now() - start;
      const arr = this.stageLatencyMs.get(stage.id) ?? [];
      arr.push(elapsed);
      if (arr.length > 1000) arr.shift();
      this.stageLatencyMs.set(stage.id, arr);
      this.runCount.set(stage.id, (this.runCount.get(stage.id) ?? 0) + 1);
    }
  }

  async runStagesBatch(stages: PipelineStage[]): Promise<void> {
    const batch = this.config.batchStages
      ? stages.slice(0, this.config.maxBatchSize)
      : stages;
    await Promise.all(batch.map((s) => this.runStage(s)));
  }

  getStageLatencyP50(stageId: string): number {
    const arr = this.stageLatencyMs.get(stageId);
    if (!arr || arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.5)] ?? 0;
  }

  getMetrics(): PerfMetric[] {
    const metrics: PerfMetric[] = [];
    const now = Date.now();
    for (const [id, latencies] of this.stageLatencyMs) {
      if (latencies.length === 0) continue;
      const sorted = [...latencies].sort((a, b) => a - b);
      const p50 = sorted[Math.floor(sorted.length * 0.5)] ?? 0;
      const p99 = sorted[Math.floor(sorted.length * 0.99)] ?? 0;
      metrics.push(
        { name: `pipeline.${id}.p50_ms`, value: p50, unit: 'ms', timestamp: now },
        { name: `pipeline.${id}.p99_ms`, value: p99, unit: 'ms', timestamp: now }
      );
    }
    return metrics;
  }
}
