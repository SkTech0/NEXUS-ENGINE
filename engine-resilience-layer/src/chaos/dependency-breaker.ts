/**
 * Dependency breaker — simulate dependency failure for chaos testing.
 * Additive; no change to engine semantics. Use in test/harness only.
 */

import type { ResilienceMetric } from '../types';

export interface DependencyBreakerConfig {
  readonly enabled: boolean;
  readonly breakRate: number;
  readonly breakDurationMs: number;
}

export class DependencyBreaker {
  private readonly config: DependencyBreakerConfig;
  private readonly broken = new Set<string>();
  private readonly brokenUntil = new Map<string, number>();
  private readonly metrics = { breaks: 0, recoveries: 0 };

  constructor(config: Partial<DependencyBreakerConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      breakRate: config.breakRate ?? 0,
      breakDurationMs: config.breakDurationMs ?? 10_000,
    };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  break(dependencyId: string): void {
    if (!this.config.enabled) return;
    this.broken.add(dependencyId);
    this.brokenUntil.set(dependencyId, Date.now() + this.config.breakDurationMs);
    this.metrics.breaks++;
  }

  isBroken(dependencyId: string): boolean {
    const until = this.brokenUntil.get(dependencyId);
    if (until === undefined) return false;
    if (Date.now() >= until) {
      this.broken.delete(dependencyId);
      this.brokenUntil.delete(dependencyId);
      this.metrics.recoveries++;
      return false;
    }
    return true;
  }

  repair(dependencyId: string): void {
    this.broken.delete(dependencyId);
    this.brokenUntil.delete(dependencyId);
  }

  shouldFail(dependencyId: string): boolean {
    return this.config.enabled && this.isBroken(dependencyId);
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'dependency_breaker.broken_count', value: this.broken.size, unit: 'count', timestamp: now },
      { name: 'dependency_breaker.breaks', value: this.metrics.breaks, unit: 'count', timestamp: now },
      { name: 'dependency_breaker.recoveries', value: this.metrics.recoveries, unit: 'count', timestamp: now },
    ];
  }
}
