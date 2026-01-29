/**
 * Restore engine — restore pipeline and validation.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface RestoreEngineConfig {
  readonly maxRestoresPerWindow: number;
  readonly windowMs: number;
  readonly restoreTimeoutMs: number;
}

export class RestoreEngine {
  private readonly config: RestoreEngineConfig;
  private readonly restoreTimestamps: number[] = [];
  private readonly metrics = { restores: 0, failures: 0, validations: 0 };

  constructor(config: Partial<RestoreEngineConfig> = {}) {
    this.config = {
      maxRestoresPerWindow: config.maxRestoresPerWindow ?? 10,
      windowMs: config.windowMs ?? 3600_000,
      restoreTimeoutMs: config.restoreTimeoutMs ?? 300_000,
    };
  }

  canRestore(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const recent = this.restoreTimestamps.filter((t) => t >= windowStart);
    return recent.length < this.config.maxRestoresPerWindow;
  }

  recordRestore(success: boolean): void {
    this.restoreTimestamps.push(Date.now());
    if (success) this.metrics.restores++;
    else this.metrics.failures++;
    const windowStart = Date.now() - this.config.windowMs;
    while (this.restoreTimestamps.length > 0 && (this.restoreTimestamps[0] ?? 0) < windowStart) {
      this.restoreTimestamps.shift();
    }
  }

  recordValidation(): void {
    this.metrics.validations++;
  }

  getRestoreTimeoutMs(): number {
    return this.config.restoreTimeoutMs;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'restore_engine.restores', value: this.metrics.restores, unit: 'count', timestamp: now },
      { name: 'restore_engine.failures', value: this.metrics.failures, unit: 'count', timestamp: now },
      { name: 'restore_engine.validations', value: this.metrics.validations, unit: 'count', timestamp: now },
    ];
  }
}
