/**
 * Inference pool — pooling for AI inference requests; batching and reuse.
 * Additive; no change to engine semantics.
 */

import type { PoolConfig, PerfMetric } from '../types';

export interface InferenceSlot {
  readonly id: string;
  readonly createdAt: number;
  /** Mutable for pool management */
  inUse: boolean;
  /** Mutable for request counting */
  requestCount: number;
}

export interface InferencePoolConfig extends PoolConfig {
  readonly maxBatchSize: number;
}

export class InferencePool {
  private readonly config: InferencePoolConfig;
  private readonly slots: InferenceSlot[] = [];
  private readonly metrics = {
    acquired: 0,
    released: 0,
    batched: 0,
    created: 0,
  };

  constructor(config: Partial<InferencePoolConfig> = {}) {
    this.config = {
      minSize: config.minSize ?? 1,
      maxSize: config.maxSize ?? 8,
      idleTimeoutMs: config.idleTimeoutMs ?? 60_000,
      maxBatchSize: config.maxBatchSize ?? 16,
    };
    for (let i = 0; i < this.config.minSize; i++) {
      this.slots.push(this.createSlot());
    }
  }

  private createSlot(): InferenceSlot {
    this.metrics.created++;
    return {
      id: `inf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
      inUse: false,
      requestCount: 0,
    };
  }

  acquire(): InferenceSlot | null {
    const idle = this.slots.find((s) => !s.inUse);
    if (idle !== undefined) {
      idle.inUse = true;
      idle.requestCount++;
      this.metrics.acquired++;
      return idle;
    }
    if (this.slots.length < this.config.maxSize) {
      const slot = this.createSlot();
      slot.inUse = true;
      slot.requestCount = 1;
      this.slots.push(slot);
      this.metrics.acquired++;
      return slot;
    }
    return null;
  }

  release(slot: InferenceSlot): void {
    const s = this.slots.find((x) => x.id === slot.id);
    if (s !== undefined) {
      s.inUse = false;
      this.metrics.released++;
    }
  }

  getMaxBatchSize(): number {
    return this.config.maxBatchSize;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'inference_pool.slots', value: this.slots.length, unit: 'count', timestamp: now },
      { name: 'inference_pool.in_use', value: this.slots.filter((s) => s.inUse).length, unit: 'count', timestamp: now },
      { name: 'inference_pool.acquired', value: this.metrics.acquired, unit: 'count', timestamp: now },
      { name: 'inference_pool.released', value: this.metrics.released, unit: 'count', timestamp: now },
    ];
  }
}
