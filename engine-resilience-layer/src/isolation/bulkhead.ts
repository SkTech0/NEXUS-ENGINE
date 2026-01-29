/**
 * Bulkhead — limit concurrency and queue per compartment; isolate failure.
 * Additive; no change to engine semantics.
 */

import type { BulkheadConfig, ResilienceMetric } from '../types';

const DEFAULT_CONFIG: BulkheadConfig = {
  maxConcurrency: 10,
  maxQueue: 100,
  queueTimeoutMs: 5_000,
};

export class Bulkhead {
  private readonly config: BulkheadConfig;
  private inFlight = 0;
  private readonly queue: Array<{ resolve: (ok: boolean) => void }> = [];
  private readonly metrics = { accepted: 0, rejected: 0, timedOut: 0 };

  constructor(config: Partial<BulkheadConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async acquire(): Promise<boolean> {
    if (this.inFlight < this.config.maxConcurrency) {
      this.inFlight++;
      this.metrics.accepted++;
      return true;
    }
    if (this.queue.length >= this.config.maxQueue) {
      this.metrics.rejected++;
      return false;
    }
    return new Promise<boolean>((resolve) => {
      const entry = { resolve: resolve as (ok: boolean) => void };
      this.queue.push(entry);
      const t = setTimeout(() => {
        const i = this.queue.indexOf(entry);
        if (i >= 0) {
          this.queue.splice(i, 1);
          this.metrics.timedOut++;
          resolve(false);
        }
      }, this.config.queueTimeoutMs);
      const originalResolve = entry.resolve;
      entry.resolve = (ok: boolean) => {
        clearTimeout(t);
        originalResolve(ok);
      };
    });
  }

  release(): void {
    this.inFlight = Math.max(0, this.inFlight - 1);
    if (this.queue.length > 0 && this.inFlight < this.config.maxConcurrency) {
      const next = this.queue.shift();
      if (next) {
        this.inFlight++;
        this.metrics.accepted++;
        next.resolve(true);
      }
    }
  }

  getInFlight(): number {
    return this.inFlight;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'bulkhead.in_flight', value: this.inFlight, unit: 'count', timestamp: now },
      { name: 'bulkhead.queue_length', value: this.queue.length, unit: 'count', timestamp: now },
      { name: 'bulkhead.accepted', value: this.metrics.accepted, unit: 'count', timestamp: now },
      { name: 'bulkhead.rejected', value: this.metrics.rejected, unit: 'count', timestamp: now },
      { name: 'bulkhead.timed_out', value: this.metrics.timedOut, unit: 'count', timestamp: now },
    ];
  }
}
