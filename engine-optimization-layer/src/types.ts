/**
 * Shared types for EOP. Metrics and config only; no engine semantics.
 */

export interface PerfMetric {
  readonly name: string;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: number;
}

export interface LatencySample {
  readonly p50: number;
  readonly p95: number;
  readonly p99: number;
  readonly max: number;
  readonly count: number;
}

export interface ThroughputSample {
  readonly opsPerSecond: number;
  readonly windowMs: number;
  readonly timestamp: number;
}

export interface BeforeAfterMetrics {
  readonly before: PerfMetric[];
  readonly after: PerfMetric[];
  readonly improvement: Record<string, number>; // key -> percent change
}

export interface PoolConfig {
  readonly minSize: number;
  readonly maxSize: number;
  readonly idleTimeoutMs: number;
}

export interface CacheConfig {
  readonly maxEntries: number;
  readonly ttlMs: number;
  readonly eviction: 'lru' | 'ttl' | 'size';
}
