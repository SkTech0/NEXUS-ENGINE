/**
 * Blast radius controller — limit impact of failure to a bounded scope.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface BlastRadiusConfig {
  readonly maxAffectedKeys: number;
  readonly maxAffectedPercent: number;
  readonly isolationTimeoutMs: number;
}

export class BlastRadiusController {
  private readonly config: BlastRadiusConfig;
  private readonly affectedKeys = new Set<string>();
  private readonly isolatedUntil = new Map<string, number>();
  private readonly metrics = { limited: 0, isolated: 0 };

  constructor(config: Partial<BlastRadiusConfig> = {}) {
    this.config = {
      maxAffectedKeys: config.maxAffectedKeys ?? 100,
      maxAffectedPercent: config.maxAffectedPercent ?? 10,
      isolationTimeoutMs: config.isolationTimeoutMs ?? 60_000,
    };
  }

  recordAffected(key: string): void {
    if (this.affectedKeys.size >= this.config.maxAffectedKeys) {
      this.metrics.limited++;
      return;
    }
    this.affectedKeys.add(key);
    this.isolatedUntil.set(key, Date.now() + this.config.isolationTimeoutMs);
    this.metrics.isolated++;
  }

  isIsolated(key: string): boolean {
    const until = this.isolatedUntil.get(key);
    if (until === undefined) return false;
    if (Date.now() >= until) {
      this.affectedKeys.delete(key);
      this.isolatedUntil.delete(key);
      return false;
    }
    return true;
  }

  clearAffected(key: string): void {
    this.affectedKeys.delete(key);
    this.isolatedUntil.delete(key);
  }

  getAffectedCount(): number {
    const now = Date.now();
    for (const [k, until] of this.isolatedUntil) {
      if (now >= until) {
        this.isolatedUntil.delete(k);
        this.affectedKeys.delete(k);
      }
    }
    return this.affectedKeys.size;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'blast_radius.affected_count', value: this.getAffectedCount(), unit: 'count', timestamp: now },
      { name: 'blast_radius.limited', value: this.metrics.limited, unit: 'count', timestamp: now },
      { name: 'blast_radius.isolated', value: this.metrics.isolated, unit: 'count', timestamp: now },
    ];
  }
}
