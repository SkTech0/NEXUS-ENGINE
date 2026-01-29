/**
 * Read/write engine — read/write separation and routing for storage optimization.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface RwEngineConfig {
  readonly readWeight: number;
  readonly writeWeight: number;
  readonly maxReadsInFlight: number;
  readonly maxWritesInFlight: number;
}

export class RwEngine {
  private readonly config: RwEngineConfig;
  private readsInFlight = 0;
  private writesInFlight = 0;
  private readonly metrics = {
    reads: 0,
    writes: 0,
    readLatencySumMs: 0,
    writeLatencySumMs: 0,
  };

  constructor(config: Partial<RwEngineConfig> = {}) {
    this.config = {
      readWeight: config.readWeight ?? 1,
      writeWeight: config.writeWeight ?? 1,
      maxReadsInFlight: config.maxReadsInFlight ?? 100,
      maxWritesInFlight: config.maxWritesInFlight ?? 50,
    };
  }

  canRead(): boolean {
    return this.readsInFlight < this.config.maxReadsInFlight;
  }

  canWrite(): boolean {
    return this.writesInFlight < this.config.maxWritesInFlight;
  }

  startRead(): boolean {
    if (!this.canRead()) return false;
    this.readsInFlight++;
    return true;
  }

  endRead(latencyMs: number): void {
    this.readsInFlight = Math.max(0, this.readsInFlight - 1);
    this.metrics.reads++;
    this.metrics.readLatencySumMs += latencyMs;
  }

  startWrite(): boolean {
    if (!this.canWrite()) return false;
    this.writesInFlight++;
    return true;
  }

  endWrite(latencyMs: number): void {
    this.writesInFlight = Math.max(0, this.writesInFlight - 1);
    this.metrics.writes++;
    this.metrics.writeLatencySumMs += latencyMs;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    const avgReadMs =
      this.metrics.reads === 0 ? 0 : this.metrics.readLatencySumMs / this.metrics.reads;
    const avgWriteMs =
      this.metrics.writes === 0 ? 0 : this.metrics.writeLatencySumMs / this.metrics.writes;
    return [
      { name: 'rw.reads_in_flight', value: this.readsInFlight, unit: 'count', timestamp: now },
      { name: 'rw.writes_in_flight', value: this.writesInFlight, unit: 'count', timestamp: now },
      { name: 'rw.reads_total', value: this.metrics.reads, unit: 'count', timestamp: now },
      { name: 'rw.writes_total', value: this.metrics.writes, unit: 'count', timestamp: now },
      { name: 'rw.avg_read_latency_ms', value: avgReadMs, unit: 'ms', timestamp: now },
      { name: 'rw.avg_write_latency_ms', value: avgWriteMs, unit: 'ms', timestamp: now },
    ];
  }
}
