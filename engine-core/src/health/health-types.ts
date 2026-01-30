/**
 * Engine Core — Health model contract (ERL-4).
 * Liveness, readiness, dependency checks.
 */

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface DependencyCheck {
  readonly name: string;
  readonly status: HealthStatus;
  readonly message?: string;
  readonly latencyMs?: number;
}

export interface HealthResult {
  readonly status: HealthStatus;
  readonly engineName: string;
  readonly engineVersion: string;
  readonly checks?: DependencyCheck[];
  readonly message?: string;
  readonly timestamp: string;
}

export interface IHealthModel {
  readonly engineName: string;
  readonly engineVersion: string;

  liveness(): Promise<HealthResult>;
  readiness(): Promise<HealthResult>;
  checkDependencies(): Promise<DependencyCheck[]>;
}
