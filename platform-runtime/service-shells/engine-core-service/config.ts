/**
 * Engine-core service shell config.
 * Independent config boundary; no shared state with engine-core.
 */

export interface EngineCoreServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
}

const DEFAULTS: EngineCoreServiceConfig = {
  name: 'engine-core-service',
  port: Number(process.env['ENGINE_CORE_SERVICE_PORT']) || 3001,
  host: process.env['ENGINE_CORE_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_CORE_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot: process.env['NEXUS_REPO_ROOT'] || process.cwd(),
};

export function loadConfig(overrides?: Partial<EngineCoreServiceConfig>): EngineCoreServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
