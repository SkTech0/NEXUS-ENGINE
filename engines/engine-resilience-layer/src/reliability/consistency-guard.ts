/**
 * Consistency guard — consistency checks and guards.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface ConsistencyGuardConfig {
  readonly maxChecksPerWindow: number;
  readonly windowMs: number;
}

export class ConsistencyGuard {
  private readonly config: ConsistencyGuardConfig;
  private readonly checkTimestamps: number[] = [];
  private readonly metrics = { checks: 0, violations: 0, passed: 0 };

  constructor(config: Partial<ConsistencyGuardConfig> = {}) {
    this.config = {
      maxChecksPerWindow: config.maxChecksPerWindow ?? 1000,
      windowMs: config.windowMs ?? 60_000,
    };
  }

  recordCheck(passed: boolean): void {
    this.metrics.checks++;
    if (passed) this.metrics.passed++;
    else this.metrics.violations++;
    const now = Date.now();
    this.checkTimestamps.push(now);
    const windowStart = now - this.config.windowMs;
    while (this.checkTimestamps.length > 0 && (this.checkTimestamps[0] ?? 0) < windowStart) {
      this.checkTimestamps.shift();
    }
  }

  canCheck(): boolean {
    return this.checkTimestamps.length < this.config.maxChecksPerWindow;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'consistency_guard.checks', value: this.metrics.checks, unit: 'count', timestamp: now },
      { name: 'consistency_guard.violations', value: this.metrics.violations, unit: 'count', timestamp: now },
      { name: 'consistency_guard.passed', value: this.metrics.passed, unit: 'count', timestamp: now },
    ];
  }
}
