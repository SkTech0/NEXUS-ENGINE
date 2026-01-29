/**
 * Stream engine — streaming and buffering for data flow optimization.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface StreamEngineConfig {
  readonly chunkSize: number;
  readonly highWaterMark: number;
  readonly flushIntervalMs: number;
}

export interface StreamChunk<T = unknown> {
  readonly seq: number;
  readonly data: T;
  readonly timestamp: number;
}

export class StreamEngine<T = unknown> {
  private readonly config: StreamEngineConfig;
  private readonly buffer: StreamChunk<T>[] = [];
  private seq = 0;
  private readonly metrics = { chunksIn: 0, chunksOut: 0, flushes: 0 };

  constructor(config: Partial<StreamEngineConfig> = {}) {
    this.config = {
      chunkSize: config.chunkSize ?? 1024,
      highWaterMark: config.highWaterMark ?? 64,
      flushIntervalMs: config.flushIntervalMs ?? 100,
    };
  }

  push(data: T): void {
    this.buffer.push({
      seq: this.seq++,
      data,
      timestamp: Date.now(),
    });
    this.metrics.chunksIn++;
  }

  drain(count?: number): StreamChunk<T>[] {
    const n = count ?? this.config.chunkSize;
    const out = this.buffer.splice(0, Math.min(n, this.buffer.length));
    this.metrics.chunksOut += out.length;
    if (this.buffer.length >= this.config.highWaterMark) this.metrics.flushes++;
    return out;
  }

  getBufferLength(): number {
    return this.buffer.length;
  }

  shouldFlush(): boolean {
    return (
      this.buffer.length >= this.config.highWaterMark ||
      this.buffer.length >= this.config.chunkSize
    );
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'stream.buffer_length', value: this.buffer.length, unit: 'count', timestamp: now },
      { name: 'stream.chunks_in', value: this.metrics.chunksIn, unit: 'count', timestamp: now },
      { name: 'stream.chunks_out', value: this.metrics.chunksOut, unit: 'count', timestamp: now },
      { name: 'stream.flushes', value: this.metrics.flushes, unit: 'count', timestamp: now },
    ];
  }
}
