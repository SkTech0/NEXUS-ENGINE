/**
 * Resource guard — generic resource limits and protection.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface ResourceGuardConfig {
  readonly maxUsage: number;
  readonly warnThreshold: number;
  readonly enabled: boolean;
}

export class ResourceGuard {
  private readonly config: ResourceGuardConfig;
  private currentUsage = 0;
  private readonly metrics = { throttled: 0, warnings: 0 };

  constructor(config: Partial<ResourceGuardConfig> = {}) {
    this.config = {
      maxUsage: config.maxUsage ?? 100,
      warnThreshold: config.warnThreshold ?? 80,
      enabled: config.enabled ?? true,
    };
  }

  getUsage(): number {
    return this.currentUsage;
  }

  setUsage(usage: number): void {
    this.currentUsage = Math.max(0, usage);
    if (this.currentUsage >= this.config.warnThreshold) this.metrics.warnings++;
  }

  addUsage(delta: number): number {
    this.currentUsage = Math.max(0, this.currentUsage + delta);
    if (this.currentUsage >= this.config.warnThreshold) this.metrics.warnings++;
    return this.currentUsage;
  }

  allow(required: number): boolean {
    if (!this.config.enabled) return true;
    if (this.currentUsage + required > this.config.maxUsage) {
      this.metrics.throttled++;
      return false;
    }
    return true;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'resource_guard.usage', value: this.currentUsage, unit: 'count', timestamp: now },
      { name: 'resource_guard.throttled', value: this.metrics.throttled, unit: 'count', timestamp: now },
      { name: 'resource_guard.warnings', value: this.metrics.warnings, unit: 'count', timestamp: now },
    ];
  }
}
