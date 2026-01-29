/**
 * Resilience runner — runs resilience checks (circuit, bulkhead, retry).
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';
import { CircuitBreaker } from '../isolation/circuit-breaker';
import { Bulkhead } from '../isolation/bulkhead';
import { RetryEngine } from '../reliability/retry-engine';

export interface ResilienceRunnerConfig {
  readonly runDurationMs: number;
  readonly opCount: number;
}

export interface ResilienceRunnerResult {
  readonly metrics: ResilienceMetric[];
  readonly circuitBreaker: CircuitBreaker;
  readonly bulkhead: Bulkhead;
  readonly retryEngine: RetryEngine;
}

export async function runResilienceScenario(
  config: Partial<ResilienceRunnerConfig> = {},
  op: () => Promise<void> | void
): Promise<ResilienceRunnerResult> {
  const opCount = config.opCount ?? 50;
  const circuitBreaker = new CircuitBreaker();
  const bulkhead = new Bulkhead({ maxConcurrency: 5, maxQueue: 10 });
  const retryEngine = new RetryEngine({ maxAttempts: 3 });
  const runOp = (): Promise<void> => Promise.resolve(op());

  for (let i = 0; i < opCount; i++) {
    const ok = circuitBreaker.allow();
    if (!ok) continue;
    const acquired = await bulkhead.acquire();
    if (!acquired) continue;
    try {
      await retryEngine.execute(runOp);
      circuitBreaker.recordSuccess();
    } catch {
      circuitBreaker.recordFailure();
    } finally {
      bulkhead.release();
    }
  }

  const metrics: ResilienceMetric[] = [
    ...circuitBreaker.getMetrics(),
    ...bulkhead.getMetrics(),
    ...retryEngine.getMetrics(),
  ];

  return {
    metrics,
    circuitBreaker,
    bulkhead,
    retryEngine,
  };
}
