/**
 * State restorer — snapshot restore and state recovery.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface StateSnapshot {
  readonly snapshotId: string;
  readonly state: unknown;
  readonly version: number;
  readonly timestamp: number;
}

export interface StateRestoreConfig {
  readonly maxSnapshots: number;
  readonly restoreTimeoutMs: number;
}

export class StateRestorer {
  private readonly config: StateRestoreConfig;
  private readonly snapshots: StateSnapshot[] = [];
  private readonly metrics = { restores: 0, failures: 0, snapshotsCreated: 0 };

  constructor(config: Partial<StateRestoreConfig> = {}) {
    this.config = {
      maxSnapshots: config.maxSnapshots ?? 16,
      restoreTimeoutMs: config.restoreTimeoutMs ?? 10_000,
    };
  }

  saveSnapshot(snapshotId: string, state: unknown, version: number): void {
    while (this.snapshots.length >= this.config.maxSnapshots) {
      this.snapshots.shift();
    }
    this.snapshots.push({
      snapshotId,
      state,
      version,
      timestamp: Date.now(),
    });
    this.metrics.snapshotsCreated++;
  }

  getLatestSnapshot(): StateSnapshot | undefined {
    return this.snapshots[this.snapshots.length - 1];
  }

  getSnapshot(snapshotId: string): StateSnapshot | undefined {
    return this.snapshots.find((s) => s.snapshotId === snapshotId);
  }

  recordRestore(): void {
    this.metrics.restores++;
  }

  recordRestoreFailure(): void {
    this.metrics.failures++;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'state_restore.snapshots', value: this.snapshots.length, unit: 'count', timestamp: now },
      { name: 'state_restore.restores', value: this.metrics.restores, unit: 'count', timestamp: now },
      { name: 'state_restore.failures', value: this.metrics.failures, unit: 'count', timestamp: now },
      { name: 'state_restore.snapshots_created', value: this.metrics.snapshotsCreated, unit: 'count', timestamp: now },
    ];
  }
}
