/**
 * Engine cache layer — caching for engine-level data; LRU/TTL/size eviction.
 * Additive; no change to engine semantics.
 */

import type { CacheConfig, PerfMetric } from '../types';

export interface CacheEntry<V> {
  value: V;
  createdAt: number;
  lastAccess: number;
  size: number;
}

export class EngineCache<K = string, V = unknown> {
  private readonly config: CacheConfig;
  private readonly store = new Map<K, CacheEntry<V>>();
  private readonly accessOrder: K[] = [];
  private readonly metrics = { hits: 0, misses: 0, evictions: 0 };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxEntries: config.maxEntries ?? 1000,
      ttlMs: config.ttlMs ?? 60_000,
      eviction: config.eviction ?? 'lru',
    };
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (entry === undefined) {
      this.metrics.misses++;
      return undefined;
    }
    if (this.config.ttlMs > 0 && Date.now() - entry.createdAt > this.config.ttlMs) {
      this.delete(key);
      this.metrics.misses++;
      return undefined;
    }
    this.metrics.hits++;
    entry.lastAccess = Date.now();
    this.touchLru(key);
    return entry.value;
  }

  set(key: K, value: V, size = 1): void {
    this.evictIfNeeded(key);
    const now = Date.now();
    this.store.set(key, {
      value,
      createdAt: now,
      lastAccess: now,
      size,
    });
    this.touchLru(key);
  }

  delete(key: K): boolean {
    const existed = this.store.delete(key);
    if (existed) {
      const i = this.accessOrder.indexOf(key);
      if (i >= 0) this.accessOrder.splice(i, 1);
    }
    return existed;
  }

  private touchLru(key: K): void {
    if (this.config.eviction !== 'lru') return;
    const i = this.accessOrder.indexOf(key);
    if (i >= 0) this.accessOrder.splice(i, 1);
    this.accessOrder.push(key);
  }

  private evictIfNeeded(newKey: K): void {
    while (
      this.store.size >= this.config.maxEntries &&
      this.accessOrder.length > 0
    ) {
      const victim =
        this.config.eviction === 'lru'
          ? this.accessOrder[0]
          : this.store.keys().next().value;
      if (victim === undefined) break;
      if (victim === newKey) break;
      this.delete(victim);
      this.metrics.evictions++;
    }
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'engine_cache.entries', value: this.store.size, unit: 'count', timestamp: now },
      { name: 'engine_cache.hits', value: this.metrics.hits, unit: 'count', timestamp: now },
      { name: 'engine_cache.misses', value: this.metrics.misses, unit: 'count', timestamp: now },
      { name: 'engine_cache.evictions', value: this.metrics.evictions, unit: 'count', timestamp: now },
    ];
  }
}
