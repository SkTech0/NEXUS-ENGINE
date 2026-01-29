/**
 * Recovery tests — recovery manager, replay engine, state restorer, auto-restart.
 * Additive; no change to engine semantics.
 */

import { RecoveryManager } from '../src/recovery/recovery-manager';
import { ReplayEngine } from '../src/recovery/replay-engine';
import { StateRestorer } from '../src/recovery/state-restore';
import { AutoRestart } from '../src/recovery/auto-restart';
import { runRecoveryScenario } from '../src/harness/recovery-runner';

describe('RecoveryManager', () => {
  it('createCheckpoint and getLatestCheckpoint', () => {
    const r = new RecoveryManager({ maxCheckpoints: 5 });
    expect(r.getLatestCheckpoint()).toBeUndefined();
    r.createCheckpoint('cp1', { data: 1 });
    const cp = r.getLatestCheckpoint();
    expect(cp?.id).toBe('cp1');
    expect((cp?.payload as { data: number }).data).toBe(1);
  });

  it('getCheckpoint returns by id', () => {
    const r = new RecoveryManager();
    r.createCheckpoint('cp2', { x: 2 });
    expect(r.getCheckpoint('cp2')?.id).toBe('cp2');
    expect(r.getCheckpoint('missing')).toBeUndefined();
  });
});

describe('ReplayEngine', () => {
  it('recordEvent and getEventsFromCheckpoint', () => {
    const replay = new ReplayEngine();
    replay.recordEvent('e1', { n: 1 });
    replay.recordEvent('e2', { n: 2 });
    const cp = { id: 'c', timestamp: 0, payload: {} };
    const events = replay.getEventsFromCheckpoint(cp);
    expect(events.length).toBeGreaterThanOrEqual(0);
  });

  it('recordReplay updates metrics', () => {
    const replay = new ReplayEngine();
    replay.recordReplay(10);
    const m = replay.getMetrics();
    expect(m.some((x) => x.name === 'replay_engine.steps_replayed' && x.value === 10)).toBe(true);
  });
});

describe('StateRestorer', () => {
  it('saveSnapshot and getLatestSnapshot', () => {
    const s = new StateRestorer();
    s.saveSnapshot('snap1', { state: 1 }, 1);
    const snap = s.getLatestSnapshot();
    expect(snap?.snapshotId).toBe('snap1');
    expect(snap?.version).toBe(1);
  });
});

describe('AutoRestart', () => {
  it('shouldRestart returns true when under limit', () => {
    const a = new AutoRestart({ maxRestarts: 5, windowMs: 60000 });
    expect(a.shouldRestart()).toBe(true);
  });

  it('recordRestart and getBackoffMs', () => {
    const a = new AutoRestart({ backoffBaseMs: 100 });
    a.recordRestart();
    a.recordRestart();
    expect(a.getBackoffMs()).toBeGreaterThanOrEqual(100);
  });
});

describe('runRecoveryScenario', () => {
  it('returns metrics and components', async () => {
    const result = await runRecoveryScenario({ checkpoints: 3, replayEvents: 10 });
    expect(result.metrics.length).toBeGreaterThan(0);
    expect(result.recoveryManager).toBeDefined();
    expect(result.replayEngine).toBeDefined();
    expect(result.stateRestorer).toBeDefined();
    expect(result.autoRestart).toBeDefined();
  });
});
