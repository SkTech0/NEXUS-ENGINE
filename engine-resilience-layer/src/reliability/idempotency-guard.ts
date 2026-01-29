/**
 * Idempotency guard — enforce idempotency for duplicate requests.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface IdempotencyGuardConfig {
  readonly maxKeys: number;
  readonly ttlMs: number;
}

export class IdempotencyGuard {
  private readonly config: IdempotencyGuardConfig;
  private readonly seen = new Map<string, number>();
  private readonly metrics = { accepted: 0, duplicates: 0 };

  constructor(config: Partial<IdempotencyGuardConfig> = {}) {
    this.config = {
      maxKeys: config.maxKeys ?? 10_000,
      ttlMs: config.ttlMs ?? 86_400_000,
    };
  }

  isDuplicate(key: string): boolean {
    const expires = this.seen.get(key);
    if (expires === undefined) return false;
    if (Date.now() >= expires) {
      this.seen.delete(key);
      return false;
    }
    this.metrics.duplicates++;
    return true;
  }

  record(key: string): void {
    this.evictIfNeeded();
    this.seen.set(key, Date.now() + this.config.ttlMs);
    this.metrics.accepted++;
  }

  private evictIfNeeded(): void {
    if (this.seen.size < this.config.maxKeys) return;
    const now = Date.now();
    for (const [k, exp] of this.seen) {
      if (now >= exp) this.seen.delete(k);
    }
    while (this.seen.size >= this.config.maxKeys) {
      const first = this.seen.keys().next().value;
      if (first !== undefined) this.seen.delete(first);
      else break;
    }
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'idempotency_guard.keys', value: this.seen.size, unit: 'count', timestamp: now },
      { name: 'idempotency_guard.accepted', value: this.metrics.accepted, unit: 'count', timestamp: now },
      { name: 'idempotency_guard.duplicates', value: this.metrics.duplicates, unit: 'count', timestamp: now },
    ];
  }
}
