/**
 * Backup engine — backup orchestration and snapshot creation.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface BackupRecord {
  readonly id: string;
  readonly timestamp: number;
  readonly sizeBytes: number;
  readonly success: boolean;
}

export interface BackupEngineConfig {
  readonly maxBackups: number;
  readonly backupIntervalMs: number;
}

export class BackupEngine {
  private readonly config: BackupEngineConfig;
  private readonly backups: BackupRecord[] = [];
  private readonly metrics = { created: 0, failed: 0 };

  constructor(config: Partial<BackupEngineConfig> = {}) {
    this.config = {
      maxBackups: config.maxBackups ?? 32,
      backupIntervalMs: config.backupIntervalMs ?? 3600_000,
    };
  }

  recordBackup(id: string, sizeBytes: number, success: boolean): void {
    while (this.backups.length >= this.config.maxBackups) {
      this.backups.shift();
    }
    this.backups.push({
      id,
      timestamp: Date.now(),
      sizeBytes,
      success,
    });
    if (success) this.metrics.created++;
    else this.metrics.failed++;
  }

  getLatestBackup(): BackupRecord | undefined {
    return this.backups[this.backups.length - 1];
  }

  getBackups(): readonly BackupRecord[] {
    return this.backups;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'backup_engine.backups', value: this.backups.length, unit: 'count', timestamp: now },
      { name: 'backup_engine.created', value: this.metrics.created, unit: 'count', timestamp: now },
      { name: 'backup_engine.failed', value: this.metrics.failed, unit: 'count', timestamp: now },
    ];
  }
}
