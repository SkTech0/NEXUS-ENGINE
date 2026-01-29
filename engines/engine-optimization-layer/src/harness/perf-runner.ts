/**
 * Performance runner — runs perf collection and emits before/after metrics.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric, BeforeAfterMetrics } from '../types';

export interface PerfRunnerConfig {
  readonly sampleIntervalMs: number;
  readonly collectors: Array<() => PerfMetric[]>;
}

export class PerfRunner {
  private readonly config: PerfRunnerConfig;
  private before: PerfMetric[] = [];
  private after: PerfMetric[] = [];
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<PerfRunnerConfig> = {}) {
    this.config = {
      sampleIntervalMs: config.sampleIntervalMs ?? 1000,
      collectors: config.collectors ?? [],
    };
  }

  captureBefore(): void {
    this.before = this.collect();
  }

  captureAfter(): void {
    this.after = this.collect();
  }

  private collect(): PerfMetric[] {
    const out: PerfMetric[] = [];
    for (const fn of this.config.collectors) {
      out.push(...fn());
    }
    return out;
  }

  getBeforeAfter(): BeforeAfterMetrics {
    const beforeMap = new Map(this.before.map((m) => [m.name, m.value]));
    const afterMap = new Map(this.after.map((m) => [m.name, m.value]));
    const improvement: Record<string, number> = {};
    for (const [name, afterVal] of afterMap) {
      const beforeVal = beforeMap.get(name);
      if (beforeVal !== undefined && beforeVal !== 0) {
        improvement[name] = ((afterVal - beforeVal) / beforeVal) * 100;
      }
    }
    return {
      before: this.before,
      after: this.after,
      improvement,
    };
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => {
      this.after = this.collect();
    }, this.config.sampleIntervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
