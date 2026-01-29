/**
 * Failure tests — circuit breaker, bulkhead, retry, fault injection.
 * Additive; no change to engine semantics.
 */

import { CircuitBreaker } from '../src/isolation/circuit-breaker';
import { Bulkhead } from '../src/isolation/bulkhead';
import { RetryEngine } from '../src/reliability/retry-engine';
import { FailureSimulator } from '../src/harness/failure-simulator';

describe('CircuitBreaker', () => {
  it('starts closed and allows calls', () => {
    const c = new CircuitBreaker();
    expect(c.getState()).toBe('closed');
    expect(c.allow()).toBe(true);
  });

  it('opens after failure threshold', () => {
    const c = new CircuitBreaker({ failureThreshold: 2 });
    expect(c.allow()).toBe(true);
    c.recordFailure();
    c.recordFailure();
    expect(c.getState()).toBe('open');
    expect(c.allow()).toBe(false);
  });

  it('getMetrics returns array', () => {
    const c = new CircuitBreaker();
    expect(Array.isArray(c.getMetrics())).toBe(true);
  });
});

describe('Bulkhead', () => {
  it('acquire returns true when under concurrency', async () => {
    const b = new Bulkhead({ maxConcurrency: 2, maxQueue: 1 });
    const ok = await b.acquire();
    expect(ok).toBe(true);
    b.release();
  });

  it('getInFlight and getQueueLength return numbers', async () => {
    const b = new Bulkhead({ maxConcurrency: 1, maxQueue: 1 });
    await b.acquire();
    expect(b.getInFlight()).toBe(1);
    const p = b.acquire();
    expect(b.getQueueLength()).toBe(1);
    b.release();
    await p;
    b.release();
  });
});

describe('RetryEngine', () => {
  it('succeeds on first try', async () => {
    const r = new RetryEngine({ maxAttempts: 3 });
    let calls = 0;
    await r.execute(async () => {
      calls++;
    });
    expect(calls).toBe(1);
  });

  it('retries on failure and eventually throws', async () => {
    const r = new RetryEngine({ maxAttempts: 2, initialDelayMs: 1 });
    let calls = 0;
    await expect(
      r.execute(async () => {
        calls++;
        throw new Error('fail');
      })
    ).rejects.toThrow('fail');
    expect(calls).toBe(2);
  });
});

describe('FailureSimulator', () => {
  it('wrap executes fn when dependency not broken', async () => {
    const s = new FailureSimulator({ failureRate: 0 });
    let called = false;
    await s.wrap('dep1', async () => {
      called = true;
    });
    expect(called).toBe(true);
  });

  it('getMetrics returns array', () => {
    const s = new FailureSimulator();
    expect(Array.isArray(s.getMetrics())).toBe(true);
  });
});
