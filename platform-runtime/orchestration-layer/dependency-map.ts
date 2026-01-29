/**
 * Dependency map for decoupled services.
 * Used for startup/shutdown order; no modification to engine code.
 */

export const SERVICE_NAMES = [
  'engine-core',
  'engine-api',
  'engine-ai',
  'engine-data',
  'engine-intelligence',
  'engine-optimization',
  'engine-trust',
  'engine-distributed',
  'product-ui',
] as const;

export type ServiceName = (typeof SERVICE_NAMES)[number];

export const DEPENDENCY_MAP: Record<ServiceName, ServiceName[]> = {
  'engine-core': [],
  'engine-api': ['engine-core', 'engine-data', 'engine-intelligence', 'engine-optimization', 'engine-ai', 'engine-trust'],
  'engine-ai': ['engine-core'],
  'engine-data': [],
  'engine-intelligence': ['engine-core'],
  'engine-optimization': ['engine-core'],
  'engine-trust': ['engine-core'],
  'engine-distributed': ['engine-core', 'engine-data'],
  'product-ui': ['engine-api'],
};

export function getDependencies(service: ServiceName): ServiceName[] {
  return DEPENDENCY_MAP[service] ?? [];
}

export function getDependents(service: ServiceName): ServiceName[] {
  return (SERVICE_NAMES as readonly ServiceName[]).filter((s) =>
    (DEPENDENCY_MAP[s] ?? []).includes(service)
  );
}

export function getStartupOrder(): ServiceName[] {
  const order: ServiceName[] = [];
  const visited = new Set<ServiceName>();
  function visit(name: ServiceName) {
    if (visited.has(name)) return;
    visited.add(name);
    for (const dep of getDependencies(name)) visit(dep);
    order.push(name);
  }
  for (const s of SERVICE_NAMES) visit(s);
  return order;
}

export function getShutdownOrder(): ServiceName[] {
  return [...getStartupOrder()].reverse();
}
