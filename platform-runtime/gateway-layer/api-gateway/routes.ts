/**
 * Route definitions for API gateway.
 * Maps path prefixes to service names (service-shells).
 */

export interface RouteRule {
  prefix: string;
  service: string;
  stripPrefix?: boolean;
}

export const ROUTES: RouteRule[] = [
  { prefix: '/api/core', service: 'engine-core' },
  { prefix: '/api/engine', service: 'engine-core' },
  { prefix: '/api/ai', service: 'engine-ai' },
  { prefix: '/api/data', service: 'engine-data' },
  { prefix: '/api/intelligence', service: 'engine-intelligence' },
  { prefix: '/api/optimization', service: 'engine-optimization' },
  { prefix: '/api/trust', service: 'engine-trust' },
  { prefix: '/api/distributed', service: 'engine-distributed' },
  { prefix: '/api/engine-api', service: 'engine-api' },
  { prefix: '/api/loan', service: 'engine-api' },
  { prefix: '/swagger', service: 'engine-api' },
];

export function findRoute(pathname: string): { service: string; path: string } | null {
  for (const rule of ROUTES) {
    if (pathname.startsWith(rule.prefix)) {
      const path = rule.stripPrefix ? pathname.slice(rule.prefix.length) || '/' : pathname;
      return { service: rule.service, path };
    }
  }
  return null;
}
