/**
 * Snapshot engine — snapshot creation and catalog for DR.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface SnapshotRecord {
  readonly snapshotId: string;
  readonly timestamp: number;
  readonly payloadRef: string;
  readonly sizeBytes: number;
}

export interface SnapshotEngineConfig {
  readonly maxSnapshots: number;
  readonly retentionMs: number;
}

export class SnapshotEngine {
  private readonly config: SnapshotEngineConfig;
  private readonly snapshots: SnapshotRecord[] = [];
  private readonly metrics = { created: 0, deleted: 0 };

  constructor(config: Partial<SnapshotEngineConfig> = {}) {
    this.config = {
      maxSnapshots: config.maxSnapshots ?? 64,
      retentionMs: config.retentionMs ?? 86400_000 * 7,
    };
  }

  create(snapshotId: string, payloadRef: string, sizeBytes: number): void {
    this.evictExpired();
    while (this.snapshots.length >= this.config.maxSnapshots) {
      this.snapshots.shift();
      this.metrics.deleted++;
    }
    this.snapshots.push({
      snapshotId,
      timestamp: Date.now(),
      payloadRef,
      sizeBytes,
    });
    this.metrics.created++;
  }

  get(snapshotId: string): SnapshotRecord | undefined {
    return this.snapshots.find((s) => s.snapshotId === snapshotId);
  }

  getLatest(): SnapshotRecord | undefined {
    return this.snapshots[this.snapshots.length - 1];
  }

  private evictExpired(): void {
    const cutoff = Date.now() - this.config.retentionMs;
    while (this.snapshots.length > 0 && (this.snapshots[0]?.timestamp ?? 0) < cutoff) {
      this.snapshots.shift();
      this.metrics.deleted++;
    }
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'snapshot_engine.snapshots', value: this.snapshots.length, unit: 'count', timestamp: now },
      { name: 'snapshot_engine.created', value: this.metrics.created, unit: 'count', timestamp: now },
      { name: 'snapshot_engine.deleted', value: this.metrics.deleted, unit: 'count', timestamp: now },
    ];
  }
}
