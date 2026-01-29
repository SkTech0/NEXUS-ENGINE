/**
 * Isolation tests — circuit breaker, bulkhead, isolation pool, blast radius.
 * Additive; no change to engine semantics.
 */

import { CircuitBreaker } from '../src/isolation/circuit-breaker';
import { Bulkhead } from '../src/isolation/bulkhead';
import { IsolationPool } from '../src/isolation/isolation-pool';
import { BlastRadiusController } from '../src/isolation/blast-radius';

describe('CircuitBreaker', () => {
  it('allow and recordSuccess/recordFailure', () => {
    const c = new CircuitBreaker({ failureThreshold: 3 });
    expect(c.allow()).toBe(true);
    c.recordFailure();
    c.recordFailure();
    expect(c.getState()).toBe('closed');
    c.recordFailure();
    expect(c.getState()).toBe('open');
    expect(c.allow()).toBe(false);
  });
});

describe('Bulkhead', () => {
  it('release decrements inFlight and wakes queue', async () => {
    const b = new Bulkhead({ maxConcurrency: 1, maxQueue: 2, queueTimeoutMs: 5000 });
    await b.acquire();
    const p2 = b.acquire();
    b.release();
    const ok = await p2;
    expect(ok).toBe(true);
    b.release();
  });
});

describe('IsolationPool', () => {
  it('getCompartment is deterministic for same key', () => {
    const p = new IsolationPool({ compartments: 8 });
    const c1 = p.getCompartment('key1');
    const c2 = p.getCompartment('key1');
    expect(c1).toBe(c2);
  });

  it('tryAcquire and release', () => {
    const p = new IsolationPool({ compartments: 2, maxConcurrencyPerCompartment: 1 });
    expect(p.tryAcquire('a')).toBe(true);
    expect(p.tryAcquire('a')).toBe(false);
    expect(p.tryAcquire('b')).toBe(true);
    p.release('a');
    expect(p.tryAcquire('a')).toBe(true);
  });
});

describe('BlastRadiusController', () => {
  it('recordAffected and isIsolated', () => {
    const b = new BlastRadiusController({ isolationTimeoutMs: 100 });
    b.recordAffected('k1');
    expect(b.isIsolated('k1')).toBe(true);
  });

  it('clearAffected removes key', () => {
    const b = new BlastRadiusController();
    b.recordAffected('k2');
    b.clearAffected('k2');
    expect(b.isIsolated('k2')).toBe(false);
  });
});
