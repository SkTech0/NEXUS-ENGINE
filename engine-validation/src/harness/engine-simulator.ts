/**
 * Engine Simulator — runs engine (or stub) in a controlled way for validation.
 * Does not replace engine; wraps execute for observation and replay.
 */

import type { EnginePort } from '../../../engine-core/src/interfaces/engine-port';
import type { ReplayRecord, SnapshotRecord } from '../types';
import { DeterminismEngine } from '../validators/determinism-engine';

export interface SimulatorConfig {
  readonly recordReplays?: boolean;
  readonly recordSnapshots?: boolean;
  readonly maxReplays?: number;
}

export class EngineSimulator {
  private readonly engine: EnginePort;
  private readonly determinism: DeterminismEngine;
  private readonly replays: ReplayRecord[] = [];
  private readonly snapshots: SnapshotRecord[] = [];
  private readonly config: Required<SimulatorConfig>;

  constructor(
    engine: EnginePort,
    config: SimulatorConfig = {}
  ) {
    this.engine = engine;
    this.determinism = new DeterminismEngine();
    this.config = {
      recordReplays: config.recordReplays ?? true,
      recordSnapshots: config.recordSnapshots ?? false,
      maxReplays: config.maxReplays ?? 500,
    };
    this.determinism.setMaxRuns(this.config.maxReplays);
  }

  async execute(input: unknown, traceId?: string): Promise<unknown> {
    const timestamp = Date.now();
    const result = await this.engine.execute(input);

    if (this.config.recordReplays && traceId) {
      const record: ReplayRecord = {
        traceId: traceId,
        input,
        output: result,
        timestamp,
      };
      this.replays.push(record);
      this.determinism.record(record);
    }

    if (this.config.recordSnapshots && traceId) {
      this.snapshots.push({
        id: `snap-${timestamp}-${Math.random().toString(36).slice(2, 9)}`,
        traceId,
        state: { input, output: result },
        output: result,
        timestamp,
      });
    }

    return result;
  }

  getDeterminismEngine(): DeterminismEngine {
    return this.determinism;
  }

  getReplays(): readonly ReplayRecord[] {
    return this.replays;
  }

  getSnapshots(): readonly SnapshotRecord[] {
    return this.snapshots;
  }

  clear(): void {
    this.determinism.clear();
    this.replays.length = 0;
    this.snapshots.length = 0;
  }
}
