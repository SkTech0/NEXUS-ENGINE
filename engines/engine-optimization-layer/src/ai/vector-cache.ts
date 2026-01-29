/**
 * Vector cache — caching for embeddings/vectors; deduplication and reuse.
 * Additive; no change to engine semantics.
 */

import type { CacheConfig, PerfMetric } from '../types';

export interface VectorEntry {
  readonly key: string;
  readonly vector: number[];
  readonly createdAt: number;
}

export class VectorCache {
  private readonly config: CacheConfig;
  private readonly store = new Map<string, VectorEntry>();
  private readonly metrics = { hits: 0, misses: 0, sets: 0 };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxEntries: config.maxEntries ?? 1024,
      ttlMs: config.ttlMs ?? 300_000,
      eviction: config.eviction ?? 'lru',
    };
  }

  get(key: string): number[] | undefined {
    const entry = this.store.get(key);
    if (entry === undefined) {
      this.metrics.misses++;
      return undefined;
    }
    if (this.config.ttlMs > 0 && Date.now() - entry.createdAt > this.config.ttlMs) {
      this.store.delete(key);
      this.metrics.misses++;
      return undefined;
    }
    this.metrics.hits++;
    return entry.vector;
  }

  set(key: string, vector: number[]): void {
    while (this.store.size >= this.config.maxEntries) {
      const first = this.store.keys().next().value;
      if (first === undefined) break;
      this.store.delete(first);
    }
    this.store.set(key, {
      key,
      vector: vector.slice(0),
      createdAt: Date.now(),
    });
    this.metrics.sets++;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'vector_cache.entries', value: this.store.size, unit: 'count', timestamp: now },
      { name: 'vector_cache.hits', value: this.metrics.hits, unit: 'count', timestamp: now },
      { name: 'vector_cache.misses', value: this.metrics.misses, unit: 'count', timestamp: now },
      { name: 'vector_cache.sets', value: this.metrics.sets, unit: 'count', timestamp: now },
    ];
  }
}
