/**
 * Snapshot cache layer — snapshot caching for replay/audit efficiency.
 * Additive; no change to engine semantics.
 */

import type { CacheConfig, PerfMetric } from '../types';

export interface SnapshotEntry {
  readonly snapshotId: string;
  readonly payload: unknown;
  readonly seq: number;
  readonly createdAt: number;
}

export class SnapshotCache {
  private readonly config: CacheConfig;
  private readonly store = new Map<string, SnapshotEntry>();
  private seq = 0;
  private readonly metrics = { hits: 0, misses: 0, puts: 0 };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxEntries: config.maxEntries ?? 256,
      ttlMs: config.ttlMs ?? 120_000,
      eviction: config.eviction ?? 'lru',
    };
  }

  get(snapshotId: string): unknown | undefined {
    const entry = this.store.get(snapshotId);
    if (entry === undefined) {
      this.metrics.misses++;
      return undefined;
    }
    if (this.config.ttlMs > 0 && Date.now() - entry.createdAt > this.config.ttlMs) {
      this.store.delete(snapshotId);
      this.metrics.misses++;
      return undefined;
    }
    this.metrics.hits++;
    return entry.payload;
  }

  put(snapshotId: string, payload: unknown): void {
    while (this.store.size >= this.config.maxEntries) {
      const first = this.store.keys().next().value;
      if (first === undefined) break;
      this.store.delete(first);
    }
    this.store.set(snapshotId, {
      snapshotId,
      payload,
      seq: this.seq++,
      createdAt: Date.now(),
    });
    this.metrics.puts++;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'snapshot_cache.entries', value: this.store.size, unit: 'count', timestamp: now },
      { name: 'snapshot_cache.hits', value: this.metrics.hits, unit: 'count', timestamp: now },
      { name: 'snapshot_cache.misses', value: this.metrics.misses, unit: 'count', timestamp: now },
      { name: 'snapshot_cache.puts', value: this.metrics.puts, unit: 'count', timestamp: now },
    ];
  }
}
