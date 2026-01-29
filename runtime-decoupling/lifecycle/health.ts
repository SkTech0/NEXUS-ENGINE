/**
 * Per-engine health check.
 * Independent health; process-boundary aware.
 */

export interface HealthResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export type HealthChecker = () => Promise<HealthResult>;

const checkers: HealthChecker[] = [];

export function registerHealthChecker(checker: HealthChecker): void {
  checkers.push(checker);
}

export async function runHealthCheck(serviceName: string): Promise<HealthResult> {
  if (checkers.length === 0) {
    return {
      status: 'healthy',
      service: serviceName,
      timestamp: new Date().toISOString(),
    };
  }
  const results = await Promise.all(checkers.map((c) => c()));
  const failed = results.filter((r) => r.status === 'unhealthy');
  const degraded = results.filter((r) => r.status === 'degraded');
  const status = failed.length > 0 ? 'unhealthy' : degraded.length > 0 ? 'degraded' : 'healthy';
  return {
    status,
    service: serviceName,
    timestamp: new Date().toISOString(),
    details: { checks: results },
  };
}

export function clearHealthCheckers(): void {
  checkers.length = 0;
}
