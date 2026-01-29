/**
 * Per-engine config loader for engine-ai.
 * Independent config, no shared state.
 */

export interface AIConfig {
  name: string;
  port: number;
  host: string;
  pythonPath: string;
  modulePath: string;
  logLevel: string;
  env: string;
}

const DEFAULTS: AIConfig = {
  name: 'engine-ai',
  port: Number(process.env['ENGINE_AI_PORT']) || 3002,
  host: process.env['ENGINE_AI_HOST'] || '0.0.0.0',
  pythonPath: process.env['ENGINE_AI_PYTHON_PATH'] || 'python3',
  modulePath: process.env['ENGINE_AI_MODULE_PATH'] || 'engine-ai',
  logLevel: process.env['ENGINE_AI_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
};

export function loadAIConfig(overrides?: Partial<AIConfig>): AIConfig {
  return { ...DEFAULTS, ...overrides };
}
