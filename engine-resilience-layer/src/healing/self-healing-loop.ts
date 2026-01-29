/**
 * Self-healing loop — continuous self-correction and auto-remediation.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface SelfHealingLoopConfig {
  readonly intervalMs: number;
  readonly maxCorrectionsPerCycle: number;
  readonly enabled: boolean;
}

export class SelfHealingLoop {
  private readonly config: SelfHealingLoopConfig;
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly metrics = { cycles: 0, corrections: 0, failures: 0 };

  constructor(config: Partial<SelfHealingLoopConfig> = {}) {
    this.config = {
      intervalMs: config.intervalMs ?? 10_000,
      maxCorrectionsPerCycle: config.maxCorrectionsPerCycle ?? 5,
      enabled: config.enabled ?? true,
    };
  }

  start(checkAndCorrect: () => Promise<number> | number): void {
    if (this.running || !this.config.enabled) return;
    this.running = true;
    this.intervalId = setInterval(async () => {
      this.metrics.cycles++;
      try {
        const n = await Promise.resolve(checkAndCorrect());
        this.metrics.corrections += Math.min(n, this.config.maxCorrectionsPerCycle);
      } catch {
        this.metrics.failures++;
      }
    }, this.config.intervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'self_healing_loop.cycles', value: this.metrics.cycles, unit: 'count', timestamp: now },
      { name: 'self_healing_loop.corrections', value: this.metrics.corrections, unit: 'count', timestamp: now },
      { name: 'self_healing_loop.failures', value: this.metrics.failures, unit: 'count', timestamp: now },
    ];
  }
}
