/**
 * Chaos tests — chaos orchestrator, fault injector, latency injector, dependency breaker.
 * Additive; no change to engine semantics.
 */

import { ChaosOrchestrator } from '../src/chaos/chaos-orchestrator';
import { FaultInjector } from '../src/chaos/fault-injector';
import { LatencyInjector } from '../src/chaos/latency-injector';
import { DependencyBreaker } from '../src/chaos/dependency-breaker';
import { runChaosScenario } from '../src/harness/chaos-runner';

describe('ChaosOrchestrator', () => {
  it('starts with fault none and disabled', () => {
    const o = new ChaosOrchestrator();
    expect(o.getActiveFault()).toBe('none');
    expect(o.isEnabled()).toBe(false);
  });

  it('allows setting fault and records metrics when enabled', () => {
    const o = new ChaosOrchestrator({ enabled: true });
    o.setFault('latency');
    expect(o.getActiveFault()).toBe('latency');
    expect(o.getMetrics().length).toBeGreaterThan(0);
  });
});

describe('FaultInjector', () => {
  it('does not inject when disabled', async () => {
    const f = new FaultInjector({ enabled: false, faultRate: 1 });
    let called = false;
    await f.apply(async () => {
      called = true;
    });
    expect(called).toBe(true);
  });

  it('getMetrics returns array', () => {
    const f = new FaultInjector();
    expect(Array.isArray(f.getMetrics())).toBe(true);
  });
});

describe('LatencyInjector', () => {
  it('returns 0 delay when disabled', () => {
    const l = new LatencyInjector({ enabled: false });
    expect(l.getDelayMs()).toBe(0);
  });

  it('getMetrics returns array', () => {
    const l = new LatencyInjector();
    expect(Array.isArray(l.getMetrics())).toBe(true);
  });
});

describe('DependencyBreaker', () => {
  it('isBroken returns false when not broken', () => {
    const d = new DependencyBreaker({ enabled: true });
    expect(d.isBroken('dep1')).toBe(false);
  });

  it('shouldFail returns true after break', () => {
    const d = new DependencyBreaker({ enabled: true, breakDurationMs: 10000 });
    d.break('dep1');
    expect(d.shouldFail('dep1')).toBe(true);
    d.repair('dep1');
    expect(d.shouldFail('dep1')).toBe(false);
  });
});

describe('runChaosScenario', () => {
  it('returns metrics and components', async () => {
    const result = await runChaosScenario(
      { enabled: false, durationMs: 10 },
      async () => {}
    );
    expect(result.metrics.length).toBeGreaterThan(0);
    expect(result.orchestrator).toBeDefined();
    expect(result.faultInjector).toBeDefined();
    expect(result.latencyInjector).toBeDefined();
    expect(result.dependencyBreaker).toBeDefined();
  });
});
