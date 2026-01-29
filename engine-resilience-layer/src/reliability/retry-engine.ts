/**
 * Retry engine — retry policies with configurable attempts and backoff.
 * Additive; no change to engine semantics.
 */

import type { RetryConfig, ResilienceMetric } from '../types';

const DEFAULT_RETRY: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 100,
  maxDelayMs: 5_000,
  multiplier: 2,
  retryableErrors: [],
};

export class RetryEngine {
  private readonly config: RetryConfig;
  private readonly metrics = { attempts: 0, successes: 0, failures: 0, retries: 0 };

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_RETRY, ...config };
  }

  isRetryable(error: unknown): boolean {
    if (this.config.retryableErrors.length === 0) return true;
    const msg = error instanceof Error ? error.message : String(error);
    return this.config.retryableErrors.some((e) => msg.includes(e));
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < this.config.maxAttempts; attempt++) {
      this.metrics.attempts++;
      try {
        const result = await fn();
        this.metrics.successes++;
        return result;
      } catch (e) {
        lastError = e;
        this.metrics.failures++;
        if (attempt === this.config.maxAttempts - 1 || !this.isRetryable(e)) {
          throw e;
        }
        this.metrics.retries++;
        const delay = Math.min(
          this.config.initialDelayMs * Math.pow(this.config.multiplier, attempt),
          this.config.maxDelayMs
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw lastError;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'retry_engine.attempts', value: this.metrics.attempts, unit: 'count', timestamp: now },
      { name: 'retry_engine.successes', value: this.metrics.successes, unit: 'count', timestamp: now },
      { name: 'retry_engine.failures', value: this.metrics.failures, unit: 'count', timestamp: now },
      { name: 'retry_engine.retries', value: this.metrics.retries, unit: 'count', timestamp: now },
    ];
  }
}
