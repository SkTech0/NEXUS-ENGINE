/**
 * Service discovery for API gateway.
 * Resolves service name to base URL (env or default ports).
 */

const DEFAULT_PORTS: Record<string, number> = {
  'engine-core': 3001,
  'engine-api': 5000,
  'engine-ai': 3002,
  'engine-data': 3003,
  'engine-intelligence': 3004,
  'engine-optimization': 3005,
  'engine-trust': 3006,
  'engine-distributed': 3007,
  'product-ui': 4200,
};

const ENV_MAP: Record<string, string> = {
  'engine-core': 'ENGINE_CORE_SERVICE_PORT',
  'engine-api': 'ENGINE_API_SERVICE_PORT',
  'engine-ai': 'ENGINE_AI_SERVICE_PORT',
  'engine-data': 'ENGINE_DATA_SERVICE_PORT',
  'engine-intelligence': 'ENGINE_INTELLIGENCE_SERVICE_PORT',
  'engine-optimization': 'ENGINE_OPTIMIZATION_SERVICE_PORT',
  'engine-trust': 'ENGINE_TRUST_SERVICE_PORT',
  'engine-distributed': 'ENGINE_DISTRIBUTED_SERVICE_PORT',
  'product-ui': 'PRODUCT_UI_SERVICE_PORT',
};

const DEFAULT_HOST = process.env['GATEWAY_UPSTREAM_HOST'] || 'localhost';

export async function discoverService(serviceName: string): Promise<string | null> {
  const portEnv = ENV_MAP[serviceName];
  const port = portEnv ? Number(process.env[portEnv]) : undefined;
  const resolvedPort = port || DEFAULT_PORTS[serviceName];
  if (!resolvedPort) return null;
  return `http://${DEFAULT_HOST}:${resolvedPort}`;
}

export function getDefaultPort(serviceName: string): number | undefined {
  return DEFAULT_PORTS[serviceName];
}
