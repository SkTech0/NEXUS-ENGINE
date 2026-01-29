/**
 * Quality governor — quality shedding and service downgrade limits.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface QualityGovernorConfig {
  readonly minQualityLevel: number;
  readonly maxQualityLevel: number;
  readonly shedUnderLoad: boolean;
}

export class QualityGovernor {
  private readonly config: QualityGovernorConfig;
  private currentLevel: number;
  private readonly metrics = { sheds: 0, restores: 0 };

  constructor(config: Partial<QualityGovernorConfig> = {}) {
    this.config = {
      minQualityLevel: config.minQualityLevel ?? 0,
      maxQualityLevel: config.maxQualityLevel ?? 100,
      shedUnderLoad: config.shedUnderLoad ?? true,
    };
    this.currentLevel = this.config.maxQualityLevel;
  }

  getQualityLevel(): number {
    return this.currentLevel;
  }

  shed(amount: number): void {
    this.currentLevel = Math.max(
      this.config.minQualityLevel,
      this.currentLevel - amount
    );
    this.metrics.sheds++;
  }

  restore(amount: number): void {
    this.currentLevel = Math.min(
      this.config.maxQualityLevel,
      this.currentLevel + amount
    );
    this.metrics.restores++;
  }

  setLevel(level: number): void {
    this.currentLevel = Math.max(
      this.config.minQualityLevel,
      Math.min(this.config.maxQualityLevel, level)
    );
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'quality_governor.level', value: this.currentLevel, unit: 'level', timestamp: now },
      { name: 'quality_governor.sheds', value: this.metrics.sheds, unit: 'count', timestamp: now },
      { name: 'quality_governor.restores', value: this.metrics.restores, unit: 'count', timestamp: now },
    ];
  }
}
