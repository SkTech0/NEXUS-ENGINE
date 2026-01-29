/**
 * AI batching engine — model batching and async inference coalescing.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface BatchRequest<T = unknown> {
  readonly id: string;
  readonly payload: T;
  readonly createdAt: number;
}

export interface AiBatcherConfig {
  readonly maxBatchSize: number;
  readonly maxWaitMs: number;
}

export class AiBatcher<T = unknown> {
  private readonly config: AiBatcherConfig;
  private readonly buffer: BatchRequest<T>[] = [];
  private readonly metrics = { batches: 0, requests: 0, flushed: 0 };

  constructor(config: Partial<AiBatcherConfig> = {}) {
    this.config = {
      maxBatchSize: config.maxBatchSize ?? 16,
      maxWaitMs: config.maxWaitMs ?? 50,
    };
  }

  add(id: string, payload: T): void {
    this.buffer.push({
      id,
      payload,
      createdAt: Date.now(),
    });
    this.metrics.requests++;
  }

  drain(): BatchRequest<T>[] {
    const batch = this.buffer.splice(0, this.config.maxBatchSize);
    if (batch.length > 0) {
      this.metrics.batches++;
      this.metrics.flushed += batch.length;
    }
    return batch;
  }

  shouldFlush(): boolean {
    return (
      this.buffer.length >= this.config.maxBatchSize ||
      (this.buffer.length > 0 &&
        Date.now() - (this.buffer[0]?.createdAt ?? 0) >= this.config.maxWaitMs)
    );
  }

  getBufferLength(): number {
    return this.buffer.length;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'ai_batcher.buffer_length', value: this.buffer.length, unit: 'count', timestamp: now },
      { name: 'ai_batcher.batches', value: this.metrics.batches, unit: 'count', timestamp: now },
      { name: 'ai_batcher.requests', value: this.metrics.requests, unit: 'count', timestamp: now },
      { name: 'ai_batcher.flushed', value: this.metrics.flushed, unit: 'count', timestamp: now },
    ];
  }
}
