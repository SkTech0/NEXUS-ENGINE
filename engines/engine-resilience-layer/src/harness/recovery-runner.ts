/**
 * Recovery runner — runs recovery scenarios (checkpoint, restore, replay).
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';
import { RecoveryManager } from '../recovery/recovery-manager';
import { ReplayEngine } from '../recovery/replay-engine';
import { StateRestorer } from '../recovery/state-restore';
import { AutoRestart } from '../recovery/auto-restart';

export interface RecoveryRunnerConfig {
  readonly checkpoints: number;
  readonly replayEvents: number;
}

export interface RecoveryRunnerResult {
  readonly metrics: ResilienceMetric[];
  readonly recoveryManager: RecoveryManager;
  readonly replayEngine: ReplayEngine;
  readonly stateRestorer: StateRestorer;
  readonly autoRestart: AutoRestart;
}

export async function runRecoveryScenario(
  config: Partial<RecoveryRunnerConfig> = {}
): Promise<RecoveryRunnerResult> {
  const checkpoints = config.checkpoints ?? 5;
  const replayEvents = config.replayEvents ?? 20;

  const recoveryManager = new RecoveryManager();
  const replayEngine = new ReplayEngine();
  const stateRestorer = new StateRestorer();
  const autoRestart = new AutoRestart();

  for (let i = 0; i < checkpoints; i++) {
    recoveryManager.createCheckpoint(`cp-${i}`, { seq: i });
    stateRestorer.saveSnapshot(`snap-${i}`, { state: i }, i);
  }

  for (let i = 0; i < replayEvents; i++) {
    replayEngine.recordEvent(`evt-${i}`, { i });
  }

  const latest = recoveryManager.getLatestCheckpoint();
  if (latest) {
    const events = replayEngine.getEventsFromCheckpoint(latest);
    replayEngine.recordReplay(events.length);
    stateRestorer.recordRestore();
  }

  const metrics: ResilienceMetric[] = [
    ...recoveryManager.getMetrics(),
    ...replayEngine.getMetrics(),
    ...stateRestorer.getMetrics(),
    ...autoRestart.getMetrics(),
  ];

  return {
    metrics,
    recoveryManager,
    replayEngine,
    stateRestorer,
    autoRestart,
  };
}
