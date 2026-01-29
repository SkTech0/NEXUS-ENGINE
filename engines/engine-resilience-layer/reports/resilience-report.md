# ERH Resilience Report

## Purpose

Measures and reports resilience dimensions: isolation, recovery, degradation, chaos, healing, reliability, DR, runtime protection. Every component exposes metrics; harness provides scenario results.

## Dimensions

| Dimension | Components | Metrics |
|-----------|------------|---------|
| Isolation | CircuitBreaker, Bulkhead, IsolationPool, BlastRadiusController | state, in_flight, queue_length, affected_count |
| Recovery | RecoveryManager, ReplayEngine, StateRestorer, AutoRestart | checkpoints, restores, replays, restarts |
| Degradation | FallbackEngine, DegradationController, QualityGovernor | tier, level, shed/restore |
| Chaos | ChaosOrchestrator, FaultInjector, LatencyInjector, DependencyBreaker | injections, injected, broken_count |
| Healing | AnomalyDetector, RemediationEngine, SelfHealingLoop | anomalies, actions, corrections |
| Reliability | RetryEngine, BackoffEngine, IdempotencyGuard, ConsistencyGuard | attempts, retries, duplicates, violations |
| DR | BackupEngine, SnapshotEngine, RestoreEngine, FailoverManager | backups, snapshots, restores, failovers |
| Runtime | ResourceGuard, MemoryGuard, CpuGuard, IoGuard, QuotaController | usage, throttled, allowed |

## Harness

- `runChaosScenario` — chaos runner
- `runResilienceScenario` — circuit + bulkhead + retry
- `runRecoveryScenario` — checkpoint + replay + restore + auto-restart
- `FailureSimulator` — wrap ops with fault/latency/dependency break

## Principles

Fail fast, fail safe, fail isolated. Recover automatically, degrade gracefully, heal continuously. Protect core, preserve state, minimize blast radius.
