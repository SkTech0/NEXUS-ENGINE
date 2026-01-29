/**
 * Memory manager — allocation tracking and limits for IO/data efficiency.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface MemoryManagerConfig {
  readonly softLimitBytes: number;
  readonly hardLimitBytes: number;
  readonly trackAllocations: boolean;
}

export class MemoryManager {
  private readonly config: MemoryManagerConfig;
  private trackedBytes = 0;
  private allocationCount = 0;
  private releaseCount = 0;

  constructor(config: Partial<MemoryManagerConfig> = {}) {
    this.config = {
      softLimitBytes: config.softLimitBytes ?? 0,
      hardLimitBytes: config.hardLimitBytes ?? 0,
      trackAllocations: config.trackAllocations ?? true,
    };
  }

  trackAlloc(bytes: number): void {
    if (!this.config.trackAllocations) return;
    this.trackedBytes += bytes;
    this.allocationCount++;
  }

  trackFree(bytes: number): void {
    if (!this.config.trackAllocations) return;
    this.trackedBytes = Math.max(0, this.trackedBytes - bytes);
    this.releaseCount++;
  }

  getTrackedBytes(): number {
    return this.trackedBytes;
  }

  isOverSoftLimit(): boolean {
    return this.config.softLimitBytes > 0 && this.trackedBytes >= this.config.softLimitBytes;
  }

  isOverHardLimit(): boolean {
    return this.config.hardLimitBytes > 0 && this.trackedBytes >= this.config.hardLimitBytes;
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'memory.tracked_bytes', value: this.trackedBytes, unit: 'bytes', timestamp: now },
      { name: 'memory.allocations', value: this.allocationCount, unit: 'count', timestamp: now },
      { name: 'memory.releases', value: this.releaseCount, unit: 'count', timestamp: now },
    ];
  }
}
