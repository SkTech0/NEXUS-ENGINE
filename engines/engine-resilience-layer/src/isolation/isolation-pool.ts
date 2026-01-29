/**
 * Isolation pool — compartmentalized execution; limit blast radius.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface IsolationPoolConfig {
  readonly compartments: number;
  readonly maxConcurrencyPerCompartment: number;
}

export class IsolationPool {
  private readonly config: IsolationPoolConfig;
  private readonly inFlight: number[] = [];
  private readonly metrics = { dispatched: 0, rejected: 0 };

  constructor(config: Partial<IsolationPoolConfig> = {}) {
    this.config = {
      compartments: config.compartments ?? 8,
      maxConcurrencyPerCompartment: config.maxConcurrencyPerCompartment ?? 4,
    };
    for (let i = 0; i < this.config.compartments; i++) {
      this.inFlight.push(0);
    }
  }

  getCompartment(key: string): number {
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      h = (h << 5) - h + key.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h) % this.config.compartments;
  }

  tryAcquire(compartmentKey: string): boolean {
    const c = this.getCompartment(compartmentKey);
    const current = this.inFlight[c] ?? 0;
    if (current >= this.config.maxConcurrencyPerCompartment) {
      this.metrics.rejected++;
      return false;
    }
    this.inFlight[c] = current + 1;
    this.metrics.dispatched++;
    return true;
  }

  release(compartmentKey: string): void {
    const c = this.getCompartment(compartmentKey);
    const v = this.inFlight[c] ?? 0;
    this.inFlight[c] = Math.max(0, v - 1);
  }

  getInFlight(compartmentIndex?: number): number {
    if (compartmentIndex !== undefined) {
      return this.inFlight[compartmentIndex] ?? 0;
    }
    return this.inFlight.reduce((a, b) => a + b, 0);
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    const result: ResilienceMetric[] = [
      { name: 'isolation_pool.dispatched', value: this.metrics.dispatched, unit: 'count', timestamp: now },
      { name: 'isolation_pool.rejected', value: this.metrics.rejected, unit: 'count', timestamp: now },
      { name: 'isolation_pool.total_in_flight', value: this.getInFlight(), unit: 'count', timestamp: now },
    ];
    this.inFlight.forEach((v, i) => {
      result.push({
        name: `isolation_pool.compartment_${i}_in_flight`,
        value: v,
        unit: 'count',
        timestamp: now,
      });
    });
    return result;
  }
}
