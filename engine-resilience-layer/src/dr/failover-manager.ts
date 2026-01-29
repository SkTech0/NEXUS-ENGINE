/**
 * Failover manager — failover targets and health-based routing.
 * Additive; no change to engine semantics.
 */

import type { FailoverTarget, ResilienceMetric } from '../types';

export interface FailoverManagerConfig {
  readonly maxTargets: number;
  readonly healthCheckIntervalMs: number;
}

export class FailoverManager {
  private readonly config: FailoverManagerConfig;
  private readonly targets: FailoverTarget[] = [];
  private currentIndex = 0;
  private readonly metrics = { failovers: 0, healthChecks: 0 };

  constructor(config: Partial<FailoverManagerConfig> = {}) {
    this.config = {
      maxTargets: config.maxTargets ?? 8,
      healthCheckIntervalMs: config.healthCheckIntervalMs ?? 10_000,
    };
  }

  registerTarget(id: string, priority: number, healthy = true): void {
    if (this.targets.length >= this.config.maxTargets) return;
    if (this.targets.some((t) => t.id === id)) return;
    this.targets.push({ id, priority, healthy });
    this.targets.sort((a, b) => a.priority - b.priority);
  }

  setHealthy(id: string, healthy: boolean): void {
    const t = this.targets.find((x) => x.id === id);
    if (t !== undefined) (t as { healthy: boolean }).healthy = healthy;
  }

  getPrimary(): FailoverTarget | undefined {
    const healthy = this.targets.filter((t) => t.healthy);
    return healthy[0];
  }

  getNext(): FailoverTarget | undefined {
    const healthy = this.targets.filter((t) => t.healthy);
    if (healthy.length === 0) return undefined;
    const idx = this.currentIndex % healthy.length;
    this.currentIndex++;
    this.metrics.failovers++;
    return healthy[idx];
  }

  recordHealthCheck(): void {
    this.metrics.healthChecks++;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    const healthy = this.targets.filter((t) => t.healthy).length;
    return [
      { name: 'failover_manager.targets', value: this.targets.length, unit: 'count', timestamp: now },
      { name: 'failover_manager.healthy', value: healthy, unit: 'count', timestamp: now },
      { name: 'failover_manager.failovers', value: this.metrics.failovers, unit: 'count', timestamp: now },
      { name: 'failover_manager.health_checks', value: this.metrics.healthChecks, unit: 'count', timestamp: now },
    ];
  }
}
