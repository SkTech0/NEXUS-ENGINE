/**
 * State cache layer — state snapshot caching for read efficiency.
 * Additive; no change to engine semantics.
 */

import type { CacheConfig, PerfMetric } from '../types';

export interface StateEntry<S = unknown> {
  readonly stateId: string;
  readonly snapshot: S;
  readonly version: number;
  readonly createdAt: number;
  readonly ttlMs: number;
}

export class StateCache<S = unknown> {
  private readonly config: CacheConfig;
  private readonly store = new Map<string, StateEntry<S>>();
  private readonly metrics = { hits: 0, misses: 0, sets: 0 };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxEntries: config.maxEntries ?? 512,
      ttlMs: config.ttlMs ?? 30_000,
      eviction: config.eviction ?? 'ttl',
    };
  }

  get(stateId: string): S | undefined {
    const entry = this.store.get(stateId);
    if (entry === undefined) {
      this.metrics.misses++;
      return undefined;
    }
    if (Date.now() - entry.createdAt > (entry.ttlMs || this.config.ttlMs)) {
      this.store.delete(stateId);
      this.metrics.misses++;
      return undefined;
    }
    this.metrics.hits++;
    return entry.snapshot;
  }

  set(stateId: string, snapshot: S, version: number, ttlMs?: number): void {
    while (this.store.size >= this.config.maxEntries) {
      const first = this.store.keys().next().value;
      if (first === undefined) break;
      this.store.delete(first);
    }
    const now = Date.now();
    this.store.set(stateId, {
      stateId,
      snapshot,
      version,
      createdAt: now,
      ttlMs: ttlMs ?? this.config.ttlMs,
    });
    this.metrics.sets++;
  }

  invalidate(stateId: string): void {
    this.store.delete(stateId);
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'state_cache.entries', value: this.store.size, unit: 'count', timestamp: now },
      { name: 'state_cache.hits', value: this.metrics.hits, unit: 'count', timestamp: now },
      { name: 'state_cache.misses', value: this.metrics.misses, unit: 'count', timestamp: now },
      { name: 'state_cache.sets', value: this.metrics.sets, unit: 'count', timestamp: now },
    ];
  }
}
