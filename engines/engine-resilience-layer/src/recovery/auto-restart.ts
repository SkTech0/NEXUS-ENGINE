/**
 * Auto-restart — policy and tracking for auto-restart on failure.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface AutoRestartConfig {
  readonly maxRestarts: number;
  readonly windowMs: number;
  readonly backoffBaseMs: number;
}

export class AutoRestart {
  private readonly config: AutoRestartConfig;
  private readonly restartTimestamps: number[] = [];
  private readonly metrics = { restarts: 0, throttled: 0 };

  constructor(config: Partial<AutoRestartConfig> = {}) {
    this.config = {
      maxRestarts: config.maxRestarts ?? 5,
      windowMs: config.windowMs ?? 60_000,
      backoffBaseMs: config.backoffBaseMs ?? 1_000,
    };
  }

  shouldRestart(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const recent = this.restartTimestamps.filter((t) => t >= windowStart);
    if (recent.length >= this.config.maxRestarts) {
      this.metrics.throttled++;
      return false;
    }
    return true;
  }

  recordRestart(): void {
    this.restartTimestamps.push(Date.now());
    this.metrics.restarts++;
    const windowStart = Date.now() - this.config.windowMs;
    while (this.restartTimestamps.length > 0 && (this.restartTimestamps[0] ?? 0) < windowStart) {
      this.restartTimestamps.shift();
    }
  }

  getBackoffMs(): number {
    const recent = this.restartTimestamps.length;
    return Math.min(
      this.config.backoffBaseMs * Math.pow(2, recent),
      30_000
    );
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'auto_restart.restarts', value: this.metrics.restarts, unit: 'count', timestamp: now },
      { name: 'auto_restart.throttled', value: this.metrics.throttled, unit: 'count', timestamp: now },
      { name: 'auto_restart.recent_count', value: this.restartTimestamps.length, unit: 'count', timestamp: now },
    ];
  }
}
