/**
 * Memory guard — memory limits and protection.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface MemoryGuardConfig {
  readonly softLimitBytes: number;
  readonly hardLimitBytes: number;
  readonly enabled: boolean;
}

export class MemoryGuard {
  private readonly config: MemoryGuardConfig;
  private trackedBytes = 0;
  private readonly metrics = { throttled: 0, softExceeded: 0 };

  constructor(config: Partial<MemoryGuardConfig> = {}) {
    this.config = {
      softLimitBytes: config.softLimitBytes ?? 0,
      hardLimitBytes: config.hardLimitBytes ?? 0,
      enabled: config.enabled ?? true,
    };
  }

  getTrackedBytes(): number {
    return this.trackedBytes;
  }

  trackAlloc(bytes: number): void {
    this.trackedBytes += bytes;
    if (this.config.softLimitBytes > 0 && this.trackedBytes >= this.config.softLimitBytes) {
      this.metrics.softExceeded++;
    }
  }

  trackFree(bytes: number): void {
    this.trackedBytes = Math.max(0, this.trackedBytes - bytes);
  }

  allowAlloc(bytes: number): boolean {
    if (!this.config.enabled || this.config.hardLimitBytes <= 0) return true;
    if (this.trackedBytes + bytes > this.config.hardLimitBytes) {
      this.metrics.throttled++;
      return false;
    }
    return true;
  }

  isOverSoft(): boolean {
    return this.config.softLimitBytes > 0 && this.trackedBytes >= this.config.softLimitBytes;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'memory_guard.tracked_bytes', value: this.trackedBytes, unit: 'bytes', timestamp: now },
      { name: 'memory_guard.throttled', value: this.metrics.throttled, unit: 'count', timestamp: now },
      { name: 'memory_guard.soft_exceeded', value: this.metrics.softExceeded, unit: 'count', timestamp: now },
    ];
  }
}
