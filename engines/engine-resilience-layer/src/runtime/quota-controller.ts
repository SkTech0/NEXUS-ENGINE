/**
 * Quota controller — quota enforcement and limits.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface QuotaControllerConfig {
  readonly quota: number;
  readonly windowMs: number;
  readonly enabled: boolean;
}

export class QuotaController {
  private readonly config: QuotaControllerConfig;
  private used = 0;
  private windowStart = Date.now();
  private readonly metrics = { exceeded: 0, allowed: 0 };

  constructor(config: Partial<QuotaControllerConfig> = {}) {
    this.config = {
      quota: config.quota ?? 1000,
      windowMs: config.windowMs ?? 60_000,
      enabled: config.enabled ?? true,
    };
  }

  allow(amount: number): boolean {
    if (!this.config.enabled) return true;
    const now = Date.now();
    if (now - this.windowStart >= this.config.windowMs) {
      this.windowStart = now;
      this.used = 0;
    }
    if (this.used + amount > this.config.quota) {
      this.metrics.exceeded++;
      return false;
    }
    this.used += amount;
    this.metrics.allowed++;
    return true;
  }

  getUsed(): number {
    const now = Date.now();
    if (now - this.windowStart >= this.config.windowMs) return 0;
    return this.used;
  }

  getRemaining(): number {
    return Math.max(0, this.config.quota - this.getUsed());
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'quota_controller.used', value: this.getUsed(), unit: 'count', timestamp: now },
      { name: 'quota_controller.exceeded', value: this.metrics.exceeded, unit: 'count', timestamp: now },
      { name: 'quota_controller.allowed', value: this.metrics.allowed, unit: 'count', timestamp: now },
    ];
  }
}
