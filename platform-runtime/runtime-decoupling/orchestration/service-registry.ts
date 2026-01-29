/**
 * Service registry for decoupled engine components.
 * Process-boundary aware; each service is an independent process.
 */

export interface ServiceEntry {
  name: string;
  baseUrl: string;
  port: number;
  healthy: boolean;
  registeredAt: string;
}

const registry = new Map<string, ServiceEntry>();

export function registerService(name: string, baseUrl: string, port: number): void {
  registry.set(name, {
    name,
    baseUrl: baseUrl.replace(/\/$/, ''),
    port,
    healthy: true,
    registeredAt: new Date().toISOString(),
  });
}

export function unregisterService(name: string): void {
  registry.delete(name);
}

export function getService(name: string): ServiceEntry | undefined {
  return registry.get(name);
}

export function setServiceHealth(name: string, healthy: boolean): void {
  const entry = registry.get(name);
  if (entry) entry.healthy = healthy;
}

export function listServices(): ServiceEntry[] {
  return Array.from(registry.values());
}

export function clearRegistry(): void {
  registry.clear();
}
