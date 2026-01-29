/**
 * Async coordinator — coordinates async pipelines with concurrency limits and backpressure.
 * Additive wrapper; does not change task semantics.
 */

import type { PerfMetric } from '../types';

export interface AsyncCoordinatorConfig {
  readonly maxConcurrent: number;
  readonly highWaterMark: number;
}

export class AsyncCoordinator {
  private readonly config: AsyncCoordinatorConfig;
  private active = 0;
  private waiting: Array<() => void> = [];
  private readonly metrics = { started: 0, completed: 0, rejected: 0 };

  constructor(config: Partial<AsyncCoordinatorConfig> = {}) {
    this.config = {
      maxConcurrent: config.maxConcurrent ?? 100,
      highWaterMark: config.highWaterMark ?? 1000,
    };
  }

  async acquire(): Promise<void> {
    if (this.active >= this.config.maxConcurrent) {
      if (this.waiting.length >= this.config.highWaterMark) {
        this.metrics.rejected++;
        throw new Error('AsyncCoordinator: high water mark exceeded');
      }
      await new Promise<void>((resolve) => {
        this.waiting.push(resolve);
      });
    }
    this.active++;
    this.metrics.started++;
  }

  release(): void {
    this.active--;
    this.metrics.completed++;
    const next = this.waiting.shift();
    if (next) next();
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  getActive(): number {
    return this.active;
  }

  getWaiting(): number {
    return this.waiting.length;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'async_coordinator.active', value: this.active, unit: 'count', timestamp: now },
      { name: 'async_coordinator.waiting', value: this.waiting.length, unit: 'count', timestamp: now },
      { name: 'async_coordinator.started_total', value: this.metrics.started, unit: 'count', timestamp: now },
      { name: 'async_coordinator.completed_total', value: this.metrics.completed, unit: 'count', timestamp: now },
      { name: 'async_coordinator.rejected_total', value: this.metrics.rejected, unit: 'count', timestamp: now },
    ];
  }
}
