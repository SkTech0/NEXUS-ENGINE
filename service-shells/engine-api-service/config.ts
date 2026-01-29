/**
 * Engine-api service shell config.
 * Independent config boundary; no shared state with engine-api.
 */

import * as path from 'path';

export interface EngineApiServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
  projectPath: string;
  dotnetPath: string;
}

const repoRoot = process.env['NEXUS_REPO_ROOT'] || process.cwd();
const defaultProjectPath = path.join(repoRoot, 'engine-api', 'src', 'EngineApi', 'EngineApi.csproj');

const DEFAULTS: EngineApiServiceConfig = {
  name: 'engine-api-service',
  port: Number(process.env['ENGINE_API_SERVICE_PORT']) || 5000,
  host: process.env['ENGINE_API_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['ENGINE_API_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  projectPath: process.env['ENGINE_API_PROJECT_PATH'] || defaultProjectPath,
  dotnetPath: process.env['DOTNET_PATH'] || 'dotnet',
};

export function loadConfig(overrides?: Partial<EngineApiServiceConfig>): EngineApiServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
