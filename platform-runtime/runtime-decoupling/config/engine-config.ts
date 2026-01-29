/**
 * Per-engine config loader for engine-core.
 * Independent config, no shared state.
 */

export interface EngineConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot?: string;
}

const DEFAULTS: EngineConfig = {
  name: 'engine-core',
  port: Number(process.env['ENGINE_CORE_PORT']) || 3001,
  host: process.env['ENGINE_CORE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_CORE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
};

export function loadEngineConfig(overrides?: Partial<EngineConfig>): EngineConfig {
  return { ...DEFAULTS, ...overrides };
}
