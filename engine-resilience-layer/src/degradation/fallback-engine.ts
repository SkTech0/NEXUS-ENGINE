/**
 * Fallback engine — fallback strategies when primary fails or degrades.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export type FallbackTier = 'primary' | 'secondary' | 'degraded' | 'minimal';

export interface FallbackEngineConfig {
  readonly maxTiers: number;
  readonly tierCooldownMs: number;
}

export class FallbackEngine {
  private readonly config: FallbackEngineConfig;
  private currentTier: FallbackTier = 'primary';
  private tierSince = Date.now();
  private readonly metrics = { fallbacks: 0, recoveries: 0 };

  constructor(config: Partial<FallbackEngineConfig> = {}) {
    this.config = {
      maxTiers: config.maxTiers ?? 4,
      tierCooldownMs: config.tierCooldownMs ?? 5_000,
    };
  }

  getTier(): FallbackTier {
    return this.currentTier;
  }

  downgrade(): void {
    const order: FallbackTier[] = ['primary', 'secondary', 'degraded', 'minimal'];
    const i = order.indexOf(this.currentTier);
    if (i < order.length - 1) {
      this.currentTier = order[i + 1] ?? 'minimal';
      this.tierSince = Date.now();
      this.metrics.fallbacks++;
    }
  }

  upgrade(): void {
    const order: FallbackTier[] = ['primary', 'secondary', 'degraded', 'minimal'];
    const i = order.indexOf(this.currentTier);
    if (i > 0 && Date.now() - this.tierSince >= this.config.tierCooldownMs) {
      this.currentTier = order[i - 1] ?? 'primary';
      this.tierSince = Date.now();
      this.metrics.recoveries++;
    }
  }

  setTier(tier: FallbackTier): void {
    this.currentTier = tier;
    this.tierSince = Date.now();
  }

  isDegraded(): boolean {
    return this.currentTier !== 'primary';
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    const tierNum = { primary: 0, secondary: 1, degraded: 2, minimal: 3 }[this.currentTier];
    return [
      { name: 'fallback_engine.tier', value: tierNum, unit: 'enum', timestamp: now },
      { name: 'fallback_engine.fallbacks', value: this.metrics.fallbacks, unit: 'count', timestamp: now },
      { name: 'fallback_engine.recoveries', value: this.metrics.recoveries, unit: 'count', timestamp: now },
    ];
  }
}
