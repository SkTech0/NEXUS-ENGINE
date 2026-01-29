/**
 * Circuit breaker — fail fast when downstream fails; prevent cascade.
 * Additive; no change to engine semantics.
 */

import type { CircuitBreakerConfig, CircuitState, ResilienceMetric } from '../types';

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 3,
  openDurationMs: 30_000,
  halfOpenMaxCalls: 3,
};

export class CircuitBreaker {
  private readonly config: CircuitBreakerConfig;
  private state: CircuitState = 'closed';
  private failures = 0;
  private successes = 0;
  private openUntil = 0;
  private halfOpenCalls = 0;
  private readonly metrics = { trips: 0, recoveries: 0, rejected: 0 };

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getState(): CircuitState {
    if (this.state === 'open' && Date.now() >= this.openUntil) {
      this.state = 'half-open';
      this.halfOpenCalls = 0;
      this.successes = 0;
    }
    return this.state;
  }

  allow(): boolean {
    const s = this.getState();
    if (s === 'closed') return true;
    if (s === 'half-open') {
      if (this.halfOpenCalls < this.config.halfOpenMaxCalls) {
        this.halfOpenCalls++;
        return true;
      }
      this.metrics.rejected++;
      return false;
    }
    this.metrics.rejected++;
    return false;
  }

  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        this.state = 'closed';
        this.failures = 0;
        this.metrics.recoveries++;
      }
      return;
    }
    if (this.state === 'closed') this.failures = 0;
  }

  recordFailure(): void {
    if (this.state === 'half-open') {
      this.state = 'open';
      this.openUntil = Date.now() + this.config.openDurationMs;
      this.metrics.trips++;
      return;
    }
    if (this.state === 'closed') {
      this.failures++;
      if (this.failures >= this.config.failureThreshold) {
        this.state = 'open';
        this.openUntil = Date.now() + this.config.openDurationMs;
        this.metrics.trips++;
      }
    }
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'circuit_breaker.state', value: this.state === 'closed' ? 0 : this.state === 'half-open' ? 1 : 2, unit: 'enum', timestamp: now },
      { name: 'circuit_breaker.trips', value: this.metrics.trips, unit: 'count', timestamp: now },
      { name: 'circuit_breaker.recoveries', value: this.metrics.recoveries, unit: 'count', timestamp: now },
      { name: 'circuit_breaker.rejected', value: this.metrics.rejected, unit: 'count', timestamp: now },
    ];
  }
}
