/**
 * Shard router — shard routing and partitioning for distributed optimization.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface ShardRouterConfig {
  readonly shardCount: number;
  readonly replicationFactor: number;
}

export class ShardRouter {
  private readonly config: ShardRouterConfig;
  private readonly metrics = { lookups: 0, hits: 0 };

  constructor(config: Partial<ShardRouterConfig> = {}) {
    this.config = {
      shardCount: config.shardCount ?? 16,
      replicationFactor: config.replicationFactor ?? 1,
    };
  }

  getShard(key: string): number {
    this.metrics.lookups++;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    this.metrics.hits++;
    return Math.abs(hash) % this.config.shardCount;
  }

  getReplicaShards(shardId: number): number[] {
    const out: number[] = [shardId];
    for (let r = 1; r < this.config.replicationFactor; r++) {
      out.push((shardId + r) % this.config.shardCount);
    }
    return out;
  }

  getShardCount(): number {
    return this.config.shardCount;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'shard_router.shard_count', value: this.config.shardCount, unit: 'count', timestamp: now },
      { name: 'shard_router.lookups', value: this.metrics.lookups, unit: 'count', timestamp: now },
      { name: 'shard_router.hits', value: this.metrics.hits, unit: 'count', timestamp: now },
    ];
  }
}
