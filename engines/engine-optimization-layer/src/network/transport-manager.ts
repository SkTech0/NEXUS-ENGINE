/**
 * Transport manager — transport reuse and request lifecycle.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface TransportManagerConfig {
  readonly maxTransports: number;
  readonly reuseThresholdMs: number;
}

export interface TransportHandle {
  readonly id: string;
  readonly createdAt: number;
  /** Mutable for transport management */
  inUse: boolean;
  /** Mutable for request counting */
  requestCount: number;
}

export class TransportManager {
  private readonly config: TransportManagerConfig;
  private readonly transports: TransportHandle[] = [];
  private readonly metrics = { requests: 0, reused: 0, created: 0 };

  constructor(config: Partial<TransportManagerConfig> = {}) {
    this.config = {
      maxTransports: config.maxTransports ?? 10,
      reuseThresholdMs: config.reuseThresholdMs ?? 60_000,
    };
  }

  acquire(): TransportHandle {
    const idle = this.transports.find((t) => !t.inUse);
    if (idle !== undefined) {
      idle.inUse = true;
      idle.requestCount++;
      this.metrics.reused++;
      this.metrics.requests++;
      return idle;
    }
    if (this.transports.length < this.config.maxTransports) {
      const t: TransportHandle = {
        id: `transport-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
        inUse: true,
        requestCount: 1,
      };
      this.transports.push(t);
      this.metrics.created++;
      this.metrics.requests++;
      return t;
    }
    const oldest = this.transports[0];
    if (oldest === undefined) {
      const t: TransportHandle = {
        id: `transport-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
        inUse: true,
        requestCount: 1,
      };
      this.transports.push(t);
      this.metrics.created++;
      this.metrics.requests++;
      return t;
    }
    oldest.inUse = true;
    oldest.requestCount++;
    this.metrics.requests++;
    return oldest;
  }

  release(handle: TransportHandle): void {
    const t = this.transports.find((x) => x.id === handle.id);
    if (t !== undefined) t.inUse = false;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'transport.count', value: this.transports.length, unit: 'count', timestamp: now },
      { name: 'transport.requests', value: this.metrics.requests, unit: 'count', timestamp: now },
      { name: 'transport.reused', value: this.metrics.reused, unit: 'count', timestamp: now },
      { name: 'transport.created', value: this.metrics.created, unit: 'count', timestamp: now },
    ];
  }
}
