/**
 * Hot-path isolator — separates hot/cold paths for CPU optimization.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface HotPathConfig {
  readonly hotThresholdMs: number;
  readonly maxHotEntries: number;
}

export interface PathRecord {
  readonly id: string;
  readonly durationMs: number;
  readonly isHot: boolean;
  readonly timestamp: number;
}

export class HotPathEngine {
  private readonly config: HotPathConfig;
  private readonly records: PathRecord[] = [];
  private readonly hotSet = new Set<string>();

  constructor(config: Partial<HotPathConfig> = {}) {
    this.config = {
      hotThresholdMs: config.hotThresholdMs ?? 1,
      maxHotEntries: config.maxHotEntries ?? 256,
    };
  }

  record(id: string, durationMs: number): void {
    const isHot = durationMs >= this.config.hotThresholdMs;
    if (this.records.length < this.config.maxHotEntries * 2) {
      this.records.push({
        id,
        durationMs,
        isHot,
        timestamp: Date.now(),
      });
    }
    if (isHot) {
      this.hotSet.add(id);
      if (this.hotSet.size > this.config.maxHotEntries) {
        const first = this.hotSet.values().next().value;
        if (first !== undefined) this.hotSet.delete(first);
      }
    }
  }

  isHot(id: string): boolean {
    return this.hotSet.has(id);
  }

  getHotIds(): readonly string[] {
    return Array.from(this.hotSet);
  }

  getRecords(): readonly PathRecord[] {
    return this.records;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'hotpath.records', value: this.records.length, unit: 'count', timestamp: now },
      { name: 'hotpath.hot_count', value: this.hotSet.size, unit: 'count', timestamp: now },
    ];
  }
}
