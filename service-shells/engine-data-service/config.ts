/**
 * Engine-data service shell config.
 */

import * as path from 'path';

export interface EngineDataServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
  storagePath: string;
}

const repoRoot = process.env['NEXUS_REPO_ROOT'] || process.cwd();

const DEFAULTS: EngineDataServiceConfig = {
  name: 'engine-data-service',
  port: Number(process.env['ENGINE_DATA_SERVICE_PORT']) || 3003,
  host: process.env['ENGINE_DATA_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_DATA_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  storagePath: process.env['ENGINE_DATA_STORAGE_PATH'] || path.join(repoRoot, 'data'),
};

export function loadConfig(overrides?: Partial<EngineDataServiceConfig>): EngineDataServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
