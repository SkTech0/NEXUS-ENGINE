/**
 * Per-engine config loader for engine-trust.
 * Independent config, no shared state.
 */

export interface TrustConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  auditPath?: string;
}

const DEFAULTS: TrustConfig = {
  name: 'engine-trust',
  port: Number(process.env['ENGINE_TRUST_PORT']) || 3006,
  host: process.env['ENGINE_TRUST_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_TRUST_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  auditPath: process.env['ENGINE_TRUST_AUDIT_PATH'] || './audit',
};

export function loadTrustConfig(overrides?: Partial<TrustConfig>): TrustConfig {
  return { ...DEFAULTS, ...overrides };
}
