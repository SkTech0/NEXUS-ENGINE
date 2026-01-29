/**
 * Recovery manager — coordinates auto-restart, repair, and state recovery.
 * Additive; no change to engine semantics.
 */

import type { RecoveryCheckpoint, ResilienceMetric } from '../types';

export interface RecoveryManagerConfig {
  readonly maxCheckpoints: number;
  readonly recoveryTimeoutMs: number;
  readonly autoRetryAttempts: number;
}

export class RecoveryManager {
  private readonly config: RecoveryManagerConfig;
  private readonly checkpoints: RecoveryCheckpoint[] = [];
  private readonly metrics = { recoveries: 0, failures: 0, checkpointsCreated: 0 };

  constructor(config: Partial<RecoveryManagerConfig> = {}) {
    this.config = {
      maxCheckpoints: config.maxCheckpoints ?? 32,
      recoveryTimeoutMs: config.recoveryTimeoutMs ?? 30_000,
      autoRetryAttempts: config.autoRetryAttempts ?? 3,
    };
  }

  createCheckpoint(id: string, payload: unknown): void {
    while (this.checkpoints.length >= this.config.maxCheckpoints) {
      this.checkpoints.shift();
    }
    this.checkpoints.push({
      id,
      timestamp: Date.now(),
      payload,
    });
    this.metrics.checkpointsCreated++;
  }

  getLatestCheckpoint(): RecoveryCheckpoint | undefined {
    return this.checkpoints[this.checkpoints.length - 1];
  }

  getCheckpoint(id: string): RecoveryCheckpoint | undefined {
    return this.checkpoints.find((c) => c.id === id);
  }

  getCheckpoints(): readonly RecoveryCheckpoint[] {
    return this.checkpoints;
  }

  recordRecovery(): void {
    this.metrics.recoveries++;
  }

  recordRecoveryFailure(): void {
    this.metrics.failures++;
  }

  getRecoveryTimeoutMs(): number {
    return this.config.recoveryTimeoutMs;
  }

  getAutoRetryAttempts(): number {
    return this.config.autoRetryAttempts;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'recovery_manager.checkpoints', value: this.checkpoints.length, unit: 'count', timestamp: now },
      { name: 'recovery_manager.recoveries', value: this.metrics.recoveries, unit: 'count', timestamp: now },
      { name: 'recovery_manager.failures', value: this.metrics.failures, unit: 'count', timestamp: now },
      { name: 'recovery_manager.checkpoints_created', value: this.metrics.checkpointsCreated, unit: 'count', timestamp: now },
    ];
  }
}
