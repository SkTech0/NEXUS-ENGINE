/**
 * Engine-trust service shell config.
 */

export interface EngineTrustServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
  auditPath: string;
}

const repoRoot = process.env['NEXUS_REPO_ROOT'] || process.cwd();

const DEFAULTS: EngineTrustServiceConfig = {
  name: 'engine-trust-service',
  port: Number(process.env['ENGINE_TRUST_SERVICE_PORT']) || 3006,
  host: process.env['ENGINE_TRUST_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_TRUST_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  auditPath: process.env['ENGINE_TRUST_AUDIT_PATH'] || './audit',
};

export function loadConfig(overrides?: Partial<EngineTrustServiceConfig>): EngineTrustServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
