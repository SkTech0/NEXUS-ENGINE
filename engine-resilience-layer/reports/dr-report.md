# ERH Disaster Recovery Report

## Purpose

Documents disaster recovery: backup, snapshot, restore, failover. Additive; no change to engine semantics.

## Components

| Component | Role | Config |
|-----------|------|--------|
| BackupEngine | Backup orchestration and catalog | maxBackups, backupIntervalMs |
| SnapshotEngine | Snapshot creation and retention | maxSnapshots, retentionMs |
| RestoreEngine | Restore pipeline and validation | maxRestoresPerWindow, windowMs, restoreTimeoutMs |
| FailoverManager | Failover targets and health-based routing | maxTargets, healthCheckIntervalMs |

## Metrics

- backup_engine.backups, created, failed
- snapshot_engine.snapshots, created, deleted
- restore_engine.restores, failures, validations
- failover_manager.targets, healthy, failovers, health_checks

## Principles

Backup regularly, snapshot for restore, validate restores, fail over to healthy targets. DR systems are additive wrappers; engine logic unchanged.
