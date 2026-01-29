# ERH Recovery Report

## Purpose

Documents recovery engineering: auto-restart, replay, state restore, checkpoints. Every recovery component exposes metrics.

## Components

| Component | Role | Config |
|-----------|------|--------|
| RecoveryManager | Checkpoints and recovery coordination | maxCheckpoints, recoveryTimeoutMs, autoRetryAttempts |
| ReplayEngine | Event recording and replay from checkpoint | maxReplaySteps, replayTimeoutMs |
| StateRestorer | Snapshot save and restore | maxSnapshots, restoreTimeoutMs |
| AutoRestart | Restart policy and backoff | maxRestarts, windowMs, backoffBaseMs |

## Metrics

- recovery_manager.checkpoints, recoveries, failures, checkpoints_created
- replay_engine.events, replays, steps_replayed, failures
- state_restore.snapshots, restores, failures, snapshots_created
- auto_restart.restarts, throttled, recent_count

## Harness

- `runRecoveryScenario(config)` — creates checkpoints, snapshots, replay events; returns metrics and component refs.

## Principles

Preserve state, recover automatically, replay from checkpoint, throttle restarts with backoff.
