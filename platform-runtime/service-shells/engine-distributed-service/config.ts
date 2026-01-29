/**
 * Engine-distributed service shell config.
 */

import * as path from 'path';

export interface EngineDistributedServiceConfig {
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

const DEFAULTS: EngineDistributedServiceConfig = {
  name: 'engine-distributed-service',
  port: Number(process.env['ENGINE_DISTRIBUTED_SERVICE_PORT']) || 3007,
  host: process.env['ENGINE_DISTRIBUTED_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_DISTRIBUTED_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  pythonPath: process.env['ENGINE_DISTRIBUTED_PYTHON_PATH'] || 'python3',
  modulePath: path.join(repoRoot, 'engines/engine-distributed'),
};

export function loadConfig(overrides?: Partial<EngineDistributedServiceConfig>): EngineDistributedServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
