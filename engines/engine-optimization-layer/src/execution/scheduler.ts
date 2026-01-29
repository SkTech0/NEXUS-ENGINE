/**
 * Pipeline scheduler — schedules tasks with parallelism control and batching.
 * Additive wrapper; does not change task semantics.
 */

import type { PerfMetric } from '../types';

export interface ScheduledTask<T = unknown> {
  readonly id: string;
  readonly payload: T;
  readonly priority: number;
  readonly createdAt: number;
}

export interface SchedulerConfig {
  readonly maxConcurrency: number;
  readonly batchSize: number;
  readonly batchWindowMs: number;
}

export class PipelineScheduler<T = unknown> {
  private readonly config: SchedulerConfig;
  private readonly queue: ScheduledTask<T>[] = [];
  private inFlight = 0;
  private readonly metrics: { scheduled: number; executed: number; dropped: number } = {
    scheduled: 0,
    executed: 0,
    dropped: 0,
  };

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = {
      maxConcurrency: config.maxConcurrency ?? 10,
      batchSize: config.batchSize ?? 1,
      batchWindowMs: config.batchWindowMs ?? 0,
    };
  }

  schedule(id: string, payload: T, priority = 0): void {
    this.queue.push({
      id,
      payload,
      priority,
      createdAt: Date.now(),
    });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.metrics.scheduled++;
  }

  async runNext(handler: (tasks: ScheduledTask<T>[]) => Promise<void>): Promise<boolean> {
    if (this.inFlight >= this.config.maxConcurrency || this.queue.length === 0) {
      return false;
    }
    const batch = this.queue.splice(0, this.config.batchSize);
    if (batch.length === 0) return false;
    this.inFlight++;
    try {
      await handler(batch);
      this.metrics.executed += batch.length;
      return true;
    } finally {
      this.inFlight--;
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getInFlight(): number {
    return this.inFlight;
  }

  getMetrics(): PerfMetric[] {
    return [
      { name: 'scheduler.queue_length', value: this.queue.length, unit: 'count', timestamp: Date.now() },
      { name: 'scheduler.in_flight', value: this.inFlight, unit: 'count', timestamp: Date.now() },
      { name: 'scheduler.scheduled_total', value: this.metrics.scheduled, unit: 'count', timestamp: Date.now() },
      { name: 'scheduler.executed_total', value: this.metrics.executed, unit: 'count', timestamp: Date.now() },
    ];
  }
}
