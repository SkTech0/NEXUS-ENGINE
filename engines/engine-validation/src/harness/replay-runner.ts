/**
 * Replay Runner — replays recorded inputs to validate determinism and reproducibility.
 * Does not modify engine logic; observes outputs and compares.
 */

import type { EnginePort } from '../../../engine-core/src/interfaces/engine-port';
import type { ReplayRecord, ValidationResult } from '../types';
import { DeterminismEngine } from '../validators/determinism-engine';

export interface ReplayRunnerConfig {
  readonly seed?: number;
}

export class ReplayRunner {
  private readonly engine: EnginePort;
  private readonly determinism: DeterminismEngine;
  private readonly records: ReplayRecord[] = [];
  private readonly config: ReplayRunnerConfig;

  constructor(engine: EnginePort, config: ReplayRunnerConfig = {}) {
    this.engine = engine;
    this.determinism = new DeterminismEngine();
    this.config = config;
  }

  addRecord(record: ReplayRecord): this {
    this.records.push(record);
    return this;
  }

  loadRecords(records: readonly ReplayRecord[]): this {
    this.records.push(...records);
    return this;
  }

  clearRecords(): this {
    this.records.length = 0;
    return this;
  }

  async replayAll(): Promise<ValidationResult> {
    const outputs: unknown[] = [];
    for (const r of this.records) {
      const output = await this.engine.execute(r.input);
      outputs.push(output);
      this.determinism.record({
        traceId: r.traceId,
        input: r.input,
        output,
        timestamp: Date.now(),
        seed: this.config.seed ?? r.seed,
      });
    }
    return this.determinism.validateAll();
  }

  async replayForInput(input: unknown): Promise<ValidationResult> {
    const matching = this.records.filter(
      (r) => JSON.stringify(r.input) === JSON.stringify(input)
    );
    if (matching.length === 0) {
      return {
        valid: true,
        errors: [],
        metadata: { replayed: 0 },
      };
    }
    const outputs: unknown[] = [];
    for (let i = 0; i < matching.length; i++) {
      const output = await this.engine.execute(matching[i]!.input);
      outputs.push(output);
      this.determinism.record({
        traceId: matching[i]!.traceId,
        input: matching[i]!.input,
        output,
        timestamp: Date.now(),
        seed: this.config.seed,
      });
    }
    return this.determinism.validateForInput(input);
  }

  getDeterminismEngine(): DeterminismEngine {
    return this.determinism;
  }
}
