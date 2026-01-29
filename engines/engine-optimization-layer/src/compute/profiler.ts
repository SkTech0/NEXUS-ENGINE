/**
 * Compute profiler — CPU/hot-path sampling for measurable optimization.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface SampleEntry {
  readonly name: string;
  readonly startMs: number;
  readonly endMs: number;
  readonly durationMs: number;
}

export interface ProfilerConfig {
  readonly maxSamples: number;
  readonly enabled: boolean;
}

export class ComputeProfiler {
  private readonly config: ProfilerConfig;
  private readonly samples: SampleEntry[] = [];
  private readonly counters: Record<string, number> = {};
  private readonly timers = new Map<string, number>();

  constructor(config: Partial<ProfilerConfig> = {}) {
    this.config = {
      maxSamples: config.maxSamples ?? 10000,
      enabled: config.enabled ?? true,
    };
  }

  start(name: string): void {
    if (!this.config.enabled) return;
    this.timers.set(name, Date.now());
  }

  end(name: string): void {
    if (!this.config.enabled) return;
    const start = this.timers.get(name);
    this.timers.delete(name);
    if (start === undefined) return;
    const end = Date.now();
    const durationMs = end - start;
    if (this.samples.length < this.config.maxSamples) {
      this.samples.push({ name, startMs: start, endMs: end, durationMs });
    }
  }

  count(name: string, delta = 1): void {
    this.counters[name] = (this.counters[name] ?? 0) + delta;
  }

  getSamples(): readonly SampleEntry[] {
    return this.samples;
  }

  getCounters(): Readonly<Record<string, number>> {
    return { ...this.counters };
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    const result: PerfMetric[] = [
      { name: 'profiler.samples', value: this.samples.length, unit: 'count', timestamp: now },
    ];
    for (const [k, v] of Object.entries(this.counters)) {
      result.push({ name: `profiler.counter.${k}`, value: v, unit: 'count', timestamp: now });
    }
    return result;
  }

  clear(): void {
    this.samples.length = 0;
    for (const k of Object.keys(this.counters)) delete this.counters[k];
    this.timers.clear();
  }
}
