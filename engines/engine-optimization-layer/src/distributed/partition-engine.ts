/**
 * Partition engine — partitioning and locality awareness.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface PartitionEngineConfig {
  readonly partitionCount: number;
  readonly localityAware: boolean;
}

export class PartitionEngine {
  private readonly config: PartitionEngineConfig;
  private readonly partitionKeys = new Map<string, number>();
  private readonly metrics = { assignments: 0, lookups: 0 };

  constructor(config: Partial<PartitionEngineConfig> = {}) {
    this.config = {
      partitionCount: config.partitionCount ?? 64,
      localityAware: config.localityAware ?? true,
    };
  }

  getPartition(key: string): number {
    this.metrics.lookups++;
    const cached = this.partitionKeys.get(key);
    if (cached !== undefined) return cached;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const p = Math.abs(hash) % this.config.partitionCount;
    this.partitionKeys.set(key, p);
    this.metrics.assignments++;
    return p;
  }

  setPartition(key: string, partitionId: number): void {
    this.partitionKeys.set(key, partitionId % this.config.partitionCount);
    this.metrics.assignments++;
  }

  getPartitionCount(): number {
    return this.config.partitionCount;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'partition_engine.partition_count', value: this.config.partitionCount, unit: 'count', timestamp: now },
      { name: 'partition_engine.cached_keys', value: this.partitionKeys.size, unit: 'count', timestamp: now },
      { name: 'partition_engine.lookups', value: this.metrics.lookups, unit: 'count', timestamp: now },
      { name: 'partition_engine.assignments', value: this.metrics.assignments, unit: 'count', timestamp: now },
    ];
  }
}
