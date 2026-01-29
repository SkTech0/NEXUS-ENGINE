/**
 * Buffer pool — memory pooling for zero-copy patterns and reduced allocations.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface BufferPoolConfig {
  readonly bufferSize: number;
  readonly poolSize: number;
  readonly growBy: number;
}

export class BufferPool {
  private readonly config: BufferPoolConfig;
  private readonly pool: Uint8Array[] = [];
  private checkedOut = 0;
  private readonly metrics = {
    allocs: 0,
    frees: 0,
    hits: 0,
    misses: 0,
  };

  constructor(config: Partial<BufferPoolConfig> = {}) {
    this.config = {
      bufferSize: config.bufferSize ?? 4096,
      poolSize: config.poolSize ?? 64,
      growBy: config.growBy ?? 16,
    };
    for (let i = 0; i < this.config.poolSize; i++) {
      this.pool.push(new Uint8Array(this.config.bufferSize));
    }
  }

  acquire(): Uint8Array {
    const buf = this.pool.pop();
    if (buf !== undefined) {
      this.metrics.hits++;
      this.checkedOut++;
      return buf;
    }
    this.metrics.misses++;
    this.metrics.allocs++;
    this.checkedOut++;
    return new Uint8Array(this.config.bufferSize);
  }

  release(buf: Uint8Array): void {
    if (buf.length !== this.config.bufferSize) return;
    if (this.pool.length < this.config.poolSize + this.config.growBy) {
      this.pool.push(buf);
    }
    this.checkedOut--;
    this.metrics.frees++;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  getCheckedOut(): number {
    return this.checkedOut;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'buffer_pool.size', value: this.pool.length, unit: 'count', timestamp: now },
      { name: 'buffer_pool.checked_out', value: this.checkedOut, unit: 'count', timestamp: now },
      { name: 'buffer_pool.hits', value: this.metrics.hits, unit: 'count', timestamp: now },
      { name: 'buffer_pool.misses', value: this.metrics.misses, unit: 'count', timestamp: now },
      { name: 'buffer_pool.allocs', value: this.metrics.allocs, unit: 'count', timestamp: now },
    ];
  }
}
