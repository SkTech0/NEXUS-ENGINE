/**
 * Connection pool — connection pooling for network efficiency.
 * Additive; no change to engine semantics.
 */

import type { PoolConfig, PerfMetric } from '../types';

export interface PooledConnection {
  readonly id: string;
  readonly createdAt: number;
  /** Mutable for pool management */
  inUse: boolean;
  /** Mutable for last use time */
  lastUsed: number;
}

export interface ConnectionPoolConfig extends PoolConfig {
  readonly idleCheckIntervalMs: number;
}

export class ConnectionPool {
  private readonly config: ConnectionPoolConfig;
  private readonly pool: PooledConnection[] = [];
  private readonly metrics = { acquired: 0, released: 0, created: 0, idleClosed: 0 };

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = {
      minSize: config.minSize ?? 2,
      maxSize: config.maxSize ?? 20,
      idleTimeoutMs: config.idleTimeoutMs ?? 30_000,
      idleCheckIntervalMs: config.idleCheckIntervalMs ?? 5_000,
    };
    for (let i = 0; i < this.config.minSize; i++) {
      this.pool.push(this.createConnection());
    }
  }

  private createConnection(): PooledConnection {
    this.metrics.created++;
    return {
      id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
      inUse: false,
      lastUsed: Date.now(),
    };
  }

  acquire(): PooledConnection | null {
    const idle = this.pool.find((c) => !c.inUse);
    if (idle !== undefined) {
      idle.inUse = true;
      idle.lastUsed = Date.now();
      this.metrics.acquired++;
      return idle;
    }
    if (this.pool.length < this.config.maxSize) {
      const conn = this.createConnection();
      conn.inUse = true;
      conn.lastUsed = Date.now();
      this.pool.push(conn);
      this.metrics.acquired++;
      return conn;
    }
    return null;
  }

  release(conn: PooledConnection): void {
    const c = this.pool.find((p) => p.id === conn.id);
    if (c === undefined) return;
    c.inUse = false;
    c.lastUsed = Date.now();
    this.metrics.released++;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  getInUse(): number {
    return this.pool.filter((c) => c.inUse).length;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'connection_pool.size', value: this.pool.length, unit: 'count', timestamp: now },
      { name: 'connection_pool.in_use', value: this.getInUse(), unit: 'count', timestamp: now },
      { name: 'connection_pool.acquired', value: this.metrics.acquired, unit: 'count', timestamp: now },
      { name: 'connection_pool.released', value: this.metrics.released, unit: 'count', timestamp: now },
      { name: 'connection_pool.created', value: this.metrics.created, unit: 'count', timestamp: now },
    ];
  }
}
