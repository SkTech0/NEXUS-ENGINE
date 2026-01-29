/**
 * Chaos runner — runs chaos scenarios (fault, latency, dependency).
 * Additive; use in test/harness only.
 */

import type { ResilienceMetric } from '../types';
import { ChaosOrchestrator } from '../chaos/chaos-orchestrator';
import { FaultInjector } from '../chaos/fault-injector';
import { LatencyInjector } from '../chaos/latency-injector';
import { DependencyBreaker } from '../chaos/dependency-breaker';

export interface ChaosRunnerConfig {
  readonly enabled: boolean;
  readonly durationMs: number;
  readonly faultRate: number;
  readonly latencyRate: number;
}

export interface ChaosRunnerResult {
  readonly metrics: ResilienceMetric[];
  readonly orchestrator: ChaosOrchestrator;
  readonly faultInjector: FaultInjector;
  readonly latencyInjector: LatencyInjector;
  readonly dependencyBreaker: DependencyBreaker;
}

export async function runChaosScenario(
  config: Partial<ChaosRunnerConfig> = {},
  op: () => Promise<void> | void
): Promise<ChaosRunnerResult> {
  const durationMs = config.durationMs ?? 1000;
  const orchestrator = new ChaosOrchestrator({
    enabled: config.enabled ?? true,
    failureRate: config.faultRate ?? 0.1,
  });
  const faultInjector = new FaultInjector({
    enabled: config.enabled ?? true,
    faultRate: config.faultRate ?? 0.1,
  });
  const latencyInjector = new LatencyInjector({
    enabled: config.enabled ?? true,
    injectRate: config.latencyRate ?? 0.2,
  });
  const dependencyBreaker = new DependencyBreaker({ enabled: config.enabled ?? false });

  const runOp = (): Promise<void> => Promise.resolve(op());
  const end = Date.now() + durationMs;
  while (Date.now() < end) {
    await latencyInjector.inject();
    try {
      await faultInjector.apply(runOp);
    } catch {
      orchestrator.recordInjectedFailure();
    }
  }

  const metrics: ResilienceMetric[] = [
    ...orchestrator.getMetrics(),
    ...faultInjector.getMetrics(),
    ...latencyInjector.getMetrics(),
    ...dependencyBreaker.getMetrics(),
  ];

  return {
    metrics,
    orchestrator,
    faultInjector,
    latencyInjector,
    dependencyBreaker,
  };
}
