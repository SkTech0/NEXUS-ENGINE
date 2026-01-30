/**
 * Service discovery for NEXUS gateway.
 * Resolves engine-api → extracted services via registry.
 * Additive: does not replace existing gateway-layer; allows dynamic discovery.
 */

export interface ServiceDescriptor {
  name: string;
  baseUrl?: string;
  defaultBaseUrl?: string;
  port: number;
  healthPath: string;
  routes: string[];
}

export interface RegistryConfig {
  services: Record<string, Omit<ServiceDescriptor, 'name'>>;
  gateway?: { 'engine-api-base'?: string; 'legacy-engine-services'?: string };
}

let registry: RegistryConfig | null = null;

export async function loadRegistry(path?: string): Promise<RegistryConfig> {
  if (registry) return registry;
  const p = path ?? require('path').resolve(__dirname, 'service-registry.json');
  try {
    const fs = await import('fs/promises');
    const raw = await fs.readFile(p, 'utf-8');
    registry = JSON.parse(raw) as RegistryConfig;
    return registry;
  } catch {
    registry = { services: {} };
    return registry;
  }
}

export function getService(name: string): ServiceDescriptor | undefined {
  if (!registry?.services[name]) return undefined;
  const s = registry.services[name];
  return { name, ...s } as ServiceDescriptor;
}

export function resolveBaseUrl(serviceName: string, overrideBaseUrl?: string): string | undefined {
  const svc = getService(serviceName);
  if (!svc) return undefined;
  return overrideBaseUrl ?? svc.baseUrl ?? svc.defaultBaseUrl;
}

export function listDiscoveredServices(): string[] {
  return registry ? Object.keys(registry.services) : [];
}
