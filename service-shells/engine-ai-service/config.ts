/**
 * Engine-ai service shell config.
 * Independent config boundary; no shared state with engine-ai.
 */

import * as path from 'path';

export interface EngineAiServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
  pythonPath: string;
  modulePath: string;
}

const repoRoot = process.env['NEXUS_REPO_ROOT'] || process.cwd();

const DEFAULTS: EngineAiServiceConfig = {
  name: 'engine-ai-service',
  port: Number(process.env['ENGINE_AI_SERVICE_PORT']) || 3002,
  host: process.env['ENGINE_AI_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_AI_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  pythonPath: process.env['ENGINE_AI_PYTHON_PATH'] || 'python3',
  modulePath: path.join(repoRoot, 'engine-ai'),
};

export function loadConfig(overrides?: Partial<EngineAiServiceConfig>): EngineAiServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
