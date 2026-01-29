/**
 * Engine-optimization service shell config.
 */

import * as path from 'path';

export interface EngineOptimizationServiceConfig {
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

const DEFAULTS: EngineOptimizationServiceConfig = {
  name: 'engine-optimization-service',
  port: Number(process.env['ENGINE_OPTIMIZATION_SERVICE_PORT']) || 3005,
  host: process.env['ENGINE_OPTIMIZATION_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_OPTIMIZATION_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  pythonPath: process.env['ENGINE_OPTIMIZATION_PYTHON_PATH'] || 'python3',
  modulePath: path.join(repoRoot, 'engine-optimization'),
};

export function loadConfig(overrides?: Partial<EngineOptimizationServiceConfig>): EngineOptimizationServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
