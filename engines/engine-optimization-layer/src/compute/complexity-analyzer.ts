/**
 * Complexity analyzer — algorithmic complexity tracking for optimization proof.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface ComplexityRecord {
  readonly op: string;
  readonly n: number;
  readonly actualMs: number;
  readonly timestamp: number;
}

export interface ComplexityAnalyzerConfig {
  readonly maxRecords: number;
  readonly enabled: boolean;
}

export class ComplexityAnalyzer {
  private readonly config: ComplexityAnalyzerConfig;
  private readonly records: ComplexityRecord[] = [];

  constructor(config: Partial<ComplexityAnalyzerConfig> = {}) {
    this.config = {
      maxRecords: config.maxRecords ?? 1000,
      enabled: config.enabled ?? true,
    };
  }

  record(op: string, n: number, actualMs: number): void {
    if (!this.config.enabled || this.records.length >= this.config.maxRecords) return;
    this.records.push({
      op,
      n,
      actualMs,
      timestamp: Date.now(),
    });
  }

  getRecords(): readonly ComplexityRecord[] {
    return this.records;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    const avgMs =
      this.records.length === 0
        ? 0
        : this.records.reduce((s, r) => s + r.actualMs, 0) / this.records.length;
    return [
      { name: 'complexity.records', value: this.records.length, unit: 'count', timestamp: now },
      { name: 'complexity.avg_ms', value: avgMs, unit: 'ms', timestamp: now },
    ];
  }

  clear(): void {
    this.records.length = 0;
  }
}
