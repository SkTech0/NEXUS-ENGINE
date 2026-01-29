/**
 * Engine-intelligence service shell config.
 */

export interface EngineIntelligenceServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
}

const repoRoot = process.env['NEXUS_REPO_ROOT'] || process.cwd();

const DEFAULTS: EngineIntelligenceServiceConfig = {
  name: 'engine-intelligence-service',
  port: Number(process.env['ENGINE_INTELLIGENCE_SERVICE_PORT']) || 3004,
  host: process.env['ENGINE_INTELLIGENCE_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_INTELLIGENCE_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
};

export function loadConfig(overrides?: Partial<EngineIntelligenceServiceConfig>): EngineIntelligenceServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
