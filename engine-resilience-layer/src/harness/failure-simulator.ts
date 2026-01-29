/**
 * Failure simulator — simulates failures for testing resilience.
 * Additive; use in test/harness only.
 */

import type { ResilienceMetric } from '../types';
import { FaultInjector } from '../chaos/fault-injector';
import { LatencyInjector } from '../chaos/latency-injector';
import { DependencyBreaker } from '../chaos/dependency-breaker';

export interface FailureSimulatorConfig {
  readonly failureRate: number;
  readonly latencyRate: number;
  readonly dependencyBreakRate: number;
}

export class FailureSimulator {
  private readonly faultInjector: FaultInjector;
  private readonly latencyInjector: LatencyInjector;
  private readonly dependencyBreaker: DependencyBreaker;
  private readonly metrics: ResilienceMetric[] = [];

  constructor(config: Partial<FailureSimulatorConfig> = {}) {
    this.faultInjector = new FaultInjector({
      enabled: true,
      faultRate: config.failureRate ?? 0.1,
    });
    this.latencyInjector = new LatencyInjector({
      enabled: true,
      injectRate: config.latencyRate ?? 0.2,
    });
    this.dependencyBreaker = new DependencyBreaker({
      enabled: config.dependencyBreakRate !== undefined && config.dependencyBreakRate > 0,
      breakRate: config.dependencyBreakRate ?? 0,
    });
  }

  async wrap<T>(dependencyId: string, fn: () => Promise<T>): Promise<T> {
    if (this.dependencyBreaker.shouldFail(dependencyId)) {
      this.dependencyBreaker.getMetrics();
      throw new Error('FailureSimulator: dependency broken');
    }
    await this.latencyInjector.inject();
    return this.faultInjector.apply(fn);
  }

  breakDependency(dependencyId: string): void {
    this.dependencyBreaker.break(dependencyId);
  }

  repairDependency(dependencyId: string): void {
    this.dependencyBreaker.repair(dependencyId);
  }

  getMetrics(): ResilienceMetric[] {
    return [
      ...this.faultInjector.getMetrics(),
      ...this.latencyInjector.getMetrics(),
      ...this.dependencyBreaker.getMetrics(),
    ];
  }
}
