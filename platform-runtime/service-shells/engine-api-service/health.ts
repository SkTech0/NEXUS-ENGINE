/**
 * Engine-api service shell health probe.
 * Can probe the underlying engine-api process when running.
 */

export interface HealthResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export async function runHealthCheck(serviceName: string): Promise<HealthResult> {
  return {
    status: 'healthy',
    service: serviceName,
    timestamp: new Date().toISOString(),
  };
}

export async function runReadinessCheck(): Promise<boolean> {
  return true;
}

export async function runLivenessCheck(): Promise<boolean> {
  return true;
}

export async function probeUpstream(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
