/**
 * Replay engine — auto-replay from checkpoints for recovery.
 * Additive; no change to engine semantics.
 */

import type { RecoveryCheckpoint, ResilienceMetric } from '../types';

export interface ReplayEngineConfig {
  readonly maxReplaySteps: number;
  readonly replayTimeoutMs: number;
}

export class ReplayEngine {
  private readonly config: ReplayEngineConfig;
  private readonly events: Array<{ id: string; payload: unknown; ts: number }> = [];
  private readonly metrics = { replays: 0, stepsReplayed: 0, failures: 0 };

  constructor(config: Partial<ReplayEngineConfig> = {}) {
    this.config = {
      maxReplaySteps: config.maxReplaySteps ?? 1000,
      replayTimeoutMs: config.replayTimeoutMs ?? 60_000,
    };
  }

  recordEvent(id: string, payload: unknown): void {
    if (this.events.length >= this.config.maxReplaySteps) {
      this.events.shift();
    }
    this.events.push({ id, payload, ts: Date.now() });
  }

  getEventsFromCheckpoint(checkpoint: RecoveryCheckpoint): Array<{ id: string; payload: unknown; ts: number }> {
    const idx = this.events.findIndex((e) => e.ts >= checkpoint.timestamp);
    if (idx < 0) return [];
    return this.events.slice(idx);
  }

  getEventCount(): number {
    return this.events.length;
  }

  recordReplay(steps: number): void {
    this.metrics.replays++;
    this.metrics.stepsReplayed += steps;
  }

  recordReplayFailure(): void {
    this.metrics.failures++;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'replay_engine.events', value: this.events.length, unit: 'count', timestamp: now },
      { name: 'replay_engine.replays', value: this.metrics.replays, unit: 'count', timestamp: now },
      { name: 'replay_engine.steps_replayed', value: this.metrics.stepsReplayed, unit: 'count', timestamp: now },
      { name: 'replay_engine.failures', value: this.metrics.failures, unit: 'count', timestamp: now },
    ];
  }
}
