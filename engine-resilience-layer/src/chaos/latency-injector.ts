/**
 * Latency injector — inject delay for chaos testing.
 * Additive; no change to engine semantics. Use in test/harness only.
 */

import type { ResilienceMetric } from '../types';

export interface LatencyInjectorConfig {
  readonly enabled: boolean;
  readonly minMs: number;
  readonly maxMs: number;
  readonly injectRate: number;
}

export class LatencyInjector {
  private readonly config: LatencyInjectorConfig;
  private readonly metrics = { injected: 0, totalMs: 0 };

  constructor(config: Partial<LatencyInjectorConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      minMs: config.minMs ?? 10,
      maxMs: config.maxMs ?? 200,
      injectRate: config.injectRate ?? 0.2,
    };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getDelayMs(): number {
    if (!this.config.enabled || Math.random() >= this.config.injectRate) return 0;
    const ms =
      this.config.minMs +
      Math.random() * (this.config.maxMs - this.config.minMs);
    this.metrics.injected++;
    this.metrics.totalMs += ms;
    return Math.floor(ms);
  }

  async inject(): Promise<void> {
    const ms = this.getDelayMs();
    if (ms > 0) await new Promise((r) => setTimeout(r, ms));
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'latency_injector.injected', value: this.metrics.injected, unit: 'count', timestamp: now },
      { name: 'latency_injector.total_ms', value: this.metrics.totalMs, unit: 'ms', timestamp: now },
    ];
  }
}
