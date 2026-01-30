/**
 * Routing map: engine-api path → service base URL.
 * Replaces direct engine-services calls with service-registry routing.
 */

import { loadRegistry, resolveBaseUrl, getService } from './service-discovery';

export type RouteTarget = { service: string; baseUrl: string; path: string };

const PATH_TO_SERVICE: Record<string, string> = {
  '/api/AI/infer': 'engine-ai-service',
  '/api/AI/train': 'engine-ai-service',
  '/api/AI/models': 'engine-ai-service',
  '/api/AI/health': 'engine-ai-service',
  '/api/Intelligence/evaluate': 'engine-intelligence-service',
  '/api/Engine/execute': 'engine-intelligence-service',
  '/api/Intelligence/health': 'engine-intelligence-service',
  '/api/Optimization/optimize': 'engine-optimization-service',
  '/api/Optimization/health': 'engine-optimization-service',
  '/api/Trust/verify': 'engine-trust-service',
  '/api/Trust/health': 'engine-trust-service',
  '/api/Data/query': 'engine-data-service',
  '/api/Data/index': 'engine-data-service',
  '/api/Data/health': 'engine-data-service',
  '/api/Distributed/replicate': 'engine-distributed-service',
  '/api/Distributed/coordinate': 'engine-distributed-service',
  '/api/Distributed/health': 'engine-distributed-service',
};

export async function initRoutingMap(): Promise<void> {
  await loadRegistry();
}

export function routeForPath(path: string): RouteTarget | undefined {
  const normalized = path.split('?')[0];
  const serviceName = PATH_TO_SERVICE[normalized];
  if (!serviceName) return undefined;
  const baseUrl = resolveBaseUrl(serviceName);
  if (!baseUrl) return undefined;
  return { service: serviceName, baseUrl, path: normalized };
}

export function getRoutingMap(): Record<string, string> {
  return { ...PATH_TO_SERVICE };
}
