/**
 * Service discovery for decoupled engine components.
 * Resolve service base URL by name from registry or env.
 */

import { getService } from './service-registry';

const ENV_PREFIX = 'ENGINE_SERVICE_';

export function discoverServiceBaseUrl(serviceName: string): string | undefined {
  const entry = getService(serviceName);
  if (entry?.healthy) return entry.baseUrl;
  const envKey = `${ENV_PREFIX}${serviceName.toUpperCase().replace(/-/g, '_')}`;
  return process.env[envKey];
}

export function discoverServicePort(serviceName: string): number | undefined {
  const entry = getService(serviceName);
  if (entry) return entry.port;
  const portKey = `${serviceName.toUpperCase().replace(/-/g, '_')}_PORT`;
  const portEnv = process.env[portKey];
  return portEnv ? Number(portEnv) : undefined;
}
