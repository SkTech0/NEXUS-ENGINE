/**
 * Per-engine config loader for engine-intelligence.
 * Independent config, no shared state.
 */

export interface IntelligenceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
}

const DEFAULTS: IntelligenceConfig = {
  name: 'engine-intelligence',
  port: Number(process.env['ENGINE_INTELLIGENCE_PORT']) || 3004,
  host: process.env['ENGINE_INTELLIGENCE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_INTELLIGENCE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
};

export function loadIntelligenceConfig(overrides?: Partial<IntelligenceConfig>): IntelligenceConfig {
  return { ...DEFAULTS, ...overrides };
}
