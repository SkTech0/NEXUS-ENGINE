/**
 * IO guard — IO rate and concurrency limits.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface IoGuardConfig {
  readonly maxIoPerSecond: number;
  readonly maxConcurrent: number;
  readonly enabled: boolean;
}

export class IoGuard {
  private readonly config: IoGuardConfig;
  private ioCount = 0;
  private windowStart = Date.now();
  private inFlight = 0;
  private readonly metrics = { throttled: 0, allowed: 0 };

  constructor(config: Partial<IoGuardConfig> = {}) {
    this.config = {
      maxIoPerSecond: config.maxIoPerSecond ?? 1000,
      maxConcurrent: config.maxConcurrent ?? 50,
      enabled: config.enabled ?? true,
    };
  }

  allow(): boolean {
    if (!this.config.enabled) return true;
    const now = Date.now();
    if (now - this.windowStart >= 1000) {
      this.windowStart = now;
      this.ioCount = 0;
    }
    if (this.ioCount >= this.config.maxIoPerSecond || this.inFlight >= this.config.maxConcurrent) {
      this.metrics.throttled++;
      return false;
    }
    this.ioCount++;
    this.inFlight++;
    this.metrics.allowed++;
    return true;
  }

  release(): void {
    this.inFlight = Math.max(0, this.inFlight - 1);
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'io_guard.in_flight', value: this.inFlight, unit: 'count', timestamp: now },
      { name: 'io_guard.throttled', value: this.metrics.throttled, unit: 'count', timestamp: now },
      { name: 'io_guard.allowed', value: this.metrics.allowed, unit: 'count', timestamp: now },
    ];
  }
}
