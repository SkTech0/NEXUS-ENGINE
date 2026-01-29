/**
 * Chaos orchestrator — coordinates fault and latency injection.
 * Additive; no change to engine semantics. Use in test/harness only.
 */

import type { ResilienceMetric } from '../types';

export type ChaosFaultType = 'none' | 'latency' | 'failure' | 'packet_loss' | 'memory' | 'cpu' | 'dependency';

export interface ChaosOrchestratorConfig {
  readonly enabled: boolean;
  readonly maxLatencyMs: number;
  readonly failureRate: number;
}

export class ChaosOrchestrator {
  private readonly config: ChaosOrchestratorConfig;
  private activeFault: ChaosFaultType = 'none';
  private readonly metrics = { injections: 0, latencyInjected: 0, failuresInjected: 0 };

  constructor(config: Partial<ChaosOrchestratorConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      maxLatencyMs: config.maxLatencyMs ?? 500,
      failureRate: config.failureRate ?? 0,
    };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  setFault(fault: ChaosFaultType): void {
    this.activeFault = fault;
    if (fault !== 'none') this.metrics.injections++;
  }

  getActiveFault(): ChaosFaultType {
    return this.activeFault;
  }

  shouldInjectFailure(): boolean {
    if (!this.config.enabled || this.config.failureRate <= 0) return false;
    if (this.activeFault === 'failure' || this.activeFault === 'dependency') return true;
    return Math.random() < this.config.failureRate;
  }

  getLatencyMs(): number {
    if (!this.config.enabled || (this.activeFault !== 'latency' && this.activeFault !== 'packet_loss')) {
      return 0;
    }
    this.metrics.latencyInjected++;
    return Math.floor(Math.random() * this.config.maxLatencyMs) + 1;
  }

  recordInjectedFailure(): void {
    this.metrics.failuresInjected++;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'chaos_orchestrator.injections', value: this.metrics.injections, unit: 'count', timestamp: now },
      { name: 'chaos_orchestrator.latency_injected', value: this.metrics.latencyInjected, unit: 'count', timestamp: now },
      { name: 'chaos_orchestrator.failures_injected', value: this.metrics.failuresInjected, unit: 'count', timestamp: now },
    ];
  }
}
