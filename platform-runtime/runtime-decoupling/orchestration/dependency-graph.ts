/**
 * Dependency graph for engine components.
 * Ordering for startup/shutdown; no API/decision logic change.
 */

export const ENGINE_SERVICES = [
  'engine-core',
  'engine-data',
  'engine-intelligence',
  'engine-optimization',
  'engine-ai',
  'engine-trust',
  'engine-api',
  'engine-distributed',
  'product-ui',
] as const;

export type EngineServiceName = (typeof ENGINE_SERVICES)[number];

const DEPENDENCIES: Record<EngineServiceName, EngineServiceName[]> = {
  'engine-core': [],
  'engine-data': [],
  'engine-intelligence': ['engine-core'],
  'engine-optimization': ['engine-core'],
  'engine-ai': ['engine-core'],
  'engine-trust': ['engine-core'],
  'engine-api': ['engine-core', 'engine-data', 'engine-intelligence', 'engine-optimization', 'engine-ai', 'engine-trust'],
  'engine-distributed': ['engine-core', 'engine-data'],
  'product-ui': ['engine-api'],
};

export function getDependencies(service: EngineServiceName): EngineServiceName[] {
  return DEPENDENCIES[service] ?? [];
}

export function getStartupOrder(): EngineServiceName[] {
  const order: EngineServiceName[] = [];
  const visited = new Set<EngineServiceName>();
  function visit(name: EngineServiceName) {
    if (visited.has(name)) return;
    visited.add(name);
    for (const dep of getDependencies(name)) visit(dep);
    order.push(name);
  }
  for (const s of ENGINE_SERVICES) visit(s);
  return order;
}

export function getShutdownOrder(): EngineServiceName[] {
  return getStartupOrder().reverse();
}
