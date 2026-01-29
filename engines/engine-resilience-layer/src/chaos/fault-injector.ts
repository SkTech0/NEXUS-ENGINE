/**
 * Fault injector — inject failures for chaos testing.
 * Additive; no change to engine semantics. Use in test/harness only.
 */

import type { ResilienceMetric } from '../types';

export type FaultType = 'throw' | 'return_error' | 'timeout' | 'slow';

export interface FaultInjectorConfig {
  readonly enabled: boolean;
  readonly faultRate: number;
  readonly faultType: FaultType;
  readonly timeoutMs: number;
}

export class FaultInjector {
  private readonly config: FaultInjectorConfig;
  private readonly metrics = { injected: 0, skipped: 0 };

  constructor(config: Partial<FaultInjectorConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      faultRate: config.faultRate ?? 0.1,
      faultType: config.faultType ?? 'throw',
      timeoutMs: config.timeoutMs ?? 1000,
    };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  shouldInject(): boolean {
    if (!this.config.enabled) return false;
    const inject = Math.random() < this.config.faultRate;
    if (inject) this.metrics.injected++;
    else this.metrics.skipped++;
    return inject;
  }

  async apply<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.shouldInject()) return fn();
    switch (this.config.faultType) {
      case 'throw':
        throw new Error('FaultInjector: injected failure');
      case 'timeout':
        await new Promise((_, reject) =>
          setTimeout(() => reject(new Error('FaultInjector: timeout')), this.config.timeoutMs)
        );
        return fn();
      case 'slow':
        await new Promise((r) => setTimeout(r, this.config.timeoutMs));
        return fn();
      default:
        throw new Error('FaultInjector: injected failure');
    }
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'fault_injector.injected', value: this.metrics.injected, unit: 'count', timestamp: now },
      { name: 'fault_injector.skipped', value: this.metrics.skipped, unit: 'count', timestamp: now },
    ];
  }
}
