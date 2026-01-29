/**
 * CPU guard — CPU usage limits and throttling.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface CpuGuardConfig {
  readonly maxConcurrent: number;
  readonly throttleThreshold: number;
  readonly enabled: boolean;
}

export class CpuGuard {
  private readonly config: CpuGuardConfig;
  private inFlight = 0;
  private readonly metrics = { throttled: 0, allowed: 0 };

  constructor(config: Partial<CpuGuardConfig> = {}) {
    this.config = {
      maxConcurrent: config.maxConcurrent ?? 100,
      throttleThreshold: config.throttleThreshold ?? 80,
      enabled: config.enabled ?? true,
    };
  }

  getInFlight(): number {
    return this.inFlight;
  }

  allow(): boolean {
    if (!this.config.enabled) return true;
    if (this.inFlight >= this.config.maxConcurrent) {
      this.metrics.throttled++;
      return false;
    }
    this.inFlight++;
    this.metrics.allowed++;
    return true;
  }

  release(): void {
    this.inFlight = Math.max(0, this.inFlight - 1);
  }

  isThrottled(): boolean {
    return (
      this.config.enabled &&
      this.config.maxConcurrent > 0 &&
      this.inFlight >= this.config.throttleThreshold
    );
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'cpu_guard.in_flight', value: this.inFlight, unit: 'count', timestamp: now },
      { name: 'cpu_guard.throttled', value: this.metrics.throttled, unit: 'count', timestamp: now },
      { name: 'cpu_guard.allowed', value: this.metrics.allowed, unit: 'count', timestamp: now },
    ];
  }
}
