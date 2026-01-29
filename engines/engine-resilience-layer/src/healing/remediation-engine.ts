/**
 * Remediation engine — auto-mitigation and remediation actions.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export type RemediationAction = 'none' | 'isolate' | 'restart' | 'fallback' | 'throttle' | 'alert';

export interface RemediationEngineConfig {
  readonly maxActionsPerWindow: number;
  readonly windowMs: number;
}

export class RemediationEngine {
  private readonly config: RemediationEngineConfig;
  private readonly actionTimestamps: number[] = [];
  private readonly metrics = { actions: 0, isolated: 0, restarts: 0, fallbacks: 0 };

  constructor(config: Partial<RemediationEngineConfig> = {}) {
    this.config = {
      maxActionsPerWindow: config.maxActionsPerWindow ?? 20,
      windowMs: config.windowMs ?? 60_000,
    };
  }

  recordAction(action: RemediationAction): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    while (this.actionTimestamps.length > 0 && (this.actionTimestamps[0] ?? 0) < windowStart) {
      this.actionTimestamps.shift();
    }
    if (this.actionTimestamps.length >= this.config.maxActionsPerWindow) return;
    this.actionTimestamps.push(now);
    this.metrics.actions++;
    if (action === 'isolate') this.metrics.isolated++;
    if (action === 'restart') this.metrics.restarts++;
    if (action === 'fallback') this.metrics.fallbacks++;
  }

  canTakeAction(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const recent = this.actionTimestamps.filter((t) => t >= windowStart);
    return recent.length < this.config.maxActionsPerWindow;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'remediation_engine.actions', value: this.metrics.actions, unit: 'count', timestamp: now },
      { name: 'remediation_engine.isolated', value: this.metrics.isolated, unit: 'count', timestamp: now },
      { name: 'remediation_engine.restarts', value: this.metrics.restarts, unit: 'count', timestamp: now },
      { name: 'remediation_engine.fallbacks', value: this.metrics.fallbacks, unit: 'count', timestamp: now },
    ];
  }
}
