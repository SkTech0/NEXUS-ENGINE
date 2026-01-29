/**
 * Degradation tests — fallback engine, degradation controller, quality governor.
 * Additive; no change to engine semantics.
 */

import { FallbackEngine } from '../src/degradation/fallback-engine';
import { DegradationController } from '../src/degradation/degradation-controller';
import { QualityGovernor } from '../src/degradation/quality-governor';

describe('FallbackEngine', () => {
  it('starts at primary tier', () => {
    const f = new FallbackEngine();
    expect(f.getTier()).toBe('primary');
    expect(f.isDegraded()).toBe(false);
  });

  it('downgrade moves to next tier', () => {
    const f = new FallbackEngine();
    f.downgrade();
    expect(f.getTier()).toBe('secondary');
    f.downgrade();
    expect(f.getTier()).toBe('degraded');
    f.downgrade();
    expect(f.getTier()).toBe('minimal');
    f.downgrade();
    expect(f.getTier()).toBe('minimal');
  });

  it('setTier updates tier', () => {
    const f = new FallbackEngine();
    f.setTier('degraded');
    expect(f.getTier()).toBe('degraded');
  });
});

describe('DegradationController', () => {
  it('starts at level 0', () => {
    const d = new DegradationController();
    expect(d.getLevel()).toBe(0);
    expect(d.isDegraded()).toBe(false);
  });

  it('recordFailure increases level after threshold', () => {
    const d = new DegradationController({ autoDowngradeThreshold: 2 });
    d.recordFailure();
    d.recordFailure();
    expect(d.getLevel()).toBe(1);
  });

  it('recordSuccess decreases level after threshold', () => {
    const d = new DegradationController({ autoUpgradeThreshold: 2 });
    d.setLevel(1);
    d.recordSuccess();
    d.recordSuccess();
    expect(d.getLevel()).toBe(0);
  });
});

describe('QualityGovernor', () => {
  it('shed and restore', () => {
    const q = new QualityGovernor({ maxQualityLevel: 100, minQualityLevel: 0 });
    expect(q.getQualityLevel()).toBe(100);
    q.shed(30);
    expect(q.getQualityLevel()).toBe(70);
    q.restore(20);
    expect(q.getQualityLevel()).toBe(90);
  });

  it('setLevel clamps to min/max', () => {
    const q = new QualityGovernor({ maxQualityLevel: 100, minQualityLevel: 10 });
    q.setLevel(5);
    expect(q.getQualityLevel()).toBe(10);
    q.setLevel(200);
    expect(q.getQualityLevel()).toBe(100);
  });
});
