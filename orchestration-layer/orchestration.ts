/**
 * Orchestration for decoupled service-shells.
 * Coordinates startup order and discovery; no modification to engine code.
 */

import { getStartupOrder, getShutdownOrder, type ServiceName } from './dependency-map';
import { discoverService } from './discovery';
import { listServices, getService, setServiceHealth } from './service-registry';

export { getStartupOrder, getShutdownOrder };
export type { ServiceName };

export async function resolveServiceUrl(serviceName: string): Promise<string | null> {
  const entry = getService(serviceName);
  if (entry?.baseUrl) return entry.baseUrl;
  return discoverService(serviceName);
}

export async function healthCheckAll(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  const services = listServices();
  for (const s of services) {
    try {
      const res = await fetch(`${s.baseUrl}/health`);
      results[s.name] = res.ok;
      setServiceHealth(s.name, res.ok);
    } catch {
      results[s.name] = false;
      setServiceHealth(s.name, false);
    }
  }
  return results;
}

export function getStartupOrderFor(startFrom?: ServiceName): ServiceName[] {
  const full = getStartupOrder();
  if (!startFrom) return full;
  const idx = full.indexOf(startFrom);
  if (idx < 0) return full;
  return full.slice(idx);
}

export function getShutdownOrderFor(downTo?: ServiceName): ServiceName[] {
  const full = getShutdownOrder();
  if (!downTo) return full;
  const idx = full.indexOf(downTo);
  if (idx < 0) return full;
  return full.slice(0, idx + 1);
}
