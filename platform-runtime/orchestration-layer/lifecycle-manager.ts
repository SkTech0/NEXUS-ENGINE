/**
 * Lifecycle manager for decoupled service-shells.
 * Start/stop order based on dependency-map; no modification to engine code.
 */

import { getStartupOrder, getShutdownOrder, type ServiceName } from './dependency-map';
import { discoverService } from './discovery';

export interface LifecyclePhase {
  phase: 'startup' | 'shutdown';
  service: ServiceName;
  order: number;
}

export function getStartupPhases(): LifecyclePhase[] {
  return getStartupOrder().map((service, order) => ({
    phase: 'startup',
    service,
    order,
  }));
}

export function getShutdownPhases(): LifecyclePhase[] {
  return getShutdownOrder().map((service, order) => ({
    phase: 'shutdown',
    service,
    order,
  }));
}

export async function waitForService(serviceName: string, timeoutMs: number = 30_000): Promise<boolean> {
  const baseUrl = await discoverService(serviceName);
  if (!baseUrl) return false;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/health`);
      if (res.ok) return true;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

export function getRecommendedStartupSequence(): string[] {
  return getStartupOrder().slice();
}

export function getRecommendedShutdownSequence(): string[] {
  return getShutdownOrder().slice();
}
