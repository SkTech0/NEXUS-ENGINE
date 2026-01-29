/**
 * Degradation controller — degraded modes and partial response control.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface DegradationControllerConfig {
  readonly levels: number;
  readonly autoDowngradeThreshold: number;
  readonly autoUpgradeThreshold: number;
}

export class DegradationController {
  private readonly config: DegradationControllerConfig;
  private level = 0;
  private failureCount = 0;
  private successCount = 0;
  private readonly metrics = { downgrades: 0, upgrades: 0 };

  constructor(config: Partial<DegradationControllerConfig> = {}) {
    this.config = {
      levels: config.levels ?? 4,
      autoDowngradeThreshold: config.autoDowngradeThreshold ?? 5,
      autoUpgradeThreshold: config.autoUpgradeThreshold ?? 10,
    };
  }

  getLevel(): number {
    return this.level;
  }

  recordFailure(): void {
    this.failureCount++;
    this.successCount = 0;
    if (this.failureCount >= this.config.autoDowngradeThreshold && this.level < this.config.levels - 1) {
      this.level++;
      this.failureCount = 0;
      this.metrics.downgrades++;
    }
  }

  recordSuccess(): void {
    this.successCount++;
    this.failureCount = 0;
    if (this.successCount >= this.config.autoUpgradeThreshold && this.level > 0) {
      this.level--;
      this.successCount = 0;
      this.metrics.upgrades++;
    }
  }

  setLevel(l: number): void {
    this.level = Math.max(0, Math.min(l, this.config.levels - 1));
  }

  isDegraded(): boolean {
    return this.level > 0;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'degradation_controller.level', value: this.level, unit: 'level', timestamp: now },
      { name: 'degradation_controller.downgrades', value: this.metrics.downgrades, unit: 'count', timestamp: now },
      { name: 'degradation_controller.upgrades', value: this.metrics.upgrades, unit: 'count', timestamp: now },
    ];
  }
}
