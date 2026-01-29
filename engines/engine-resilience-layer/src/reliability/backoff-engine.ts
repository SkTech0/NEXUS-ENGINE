/**
 * Backoff engine — backoff strategies (linear, exponential, jitter).
 * Additive; no change to engine semantics.
 */

import type { BackoffConfig, ResilienceMetric } from '../types';

const DEFAULT_BACKOFF: BackoffConfig = {
  strategy: 'exponential',
  baseMs: 100,
  maxMs: 30_000,
  jitterFactor: 0.2,
};

export class BackoffEngine {
  private readonly config: BackoffConfig;
  private attempt = 0;
  private readonly metrics = { delays: 0, totalMs: 0 };

  constructor(config: Partial<BackoffConfig> = {}) {
    this.config = { ...DEFAULT_BACKOFF, ...config };
  }

  getDelayMs(): number {
    let ms: number;
    switch (this.config.strategy) {
      case 'linear':
        ms = this.config.baseMs * (this.attempt + 1);
        break;
      case 'jitter':
        ms = this.config.baseMs * Math.pow(2, this.attempt);
        const jitter = ms * this.config.jitterFactor * (Math.random() * 2 - 1);
        ms = ms + jitter;
        break;
      default:
        ms = this.config.baseMs * Math.pow(2, this.attempt);
    }
    ms = Math.min(ms, this.config.maxMs);
    ms = Math.max(0, Math.floor(ms));
    this.metrics.delays++;
    this.metrics.totalMs += ms;
    return ms;
  }

  nextAttempt(): number {
    const delay = this.getDelayMs();
    this.attempt++;
    return delay;
  }

  reset(): void {
    this.attempt = 0;
  }

  getAttempt(): number {
    return this.attempt;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'backoff_engine.attempt', value: this.attempt, unit: 'count', timestamp: now },
      { name: 'backoff_engine.delays', value: this.metrics.delays, unit: 'count', timestamp: now },
      { name: 'backoff_engine.total_ms', value: this.metrics.totalMs, unit: 'ms', timestamp: now },
    ];
  }
}
