/**
 * Per-engine config loader for engine-data.
 * Independent config, no shared state.
 */

export interface DataConfig {
  name: string;
  port: number;
  host: string;
  storagePath: string;
  logLevel: string;
  env: string;
}

const DEFAULTS: DataConfig = {
  name: 'engine-data',
  port: Number(process.env['ENGINE_DATA_PORT']) || 3003,
  host: process.env['ENGINE_DATA_HOST'] || '0.0.0.0',
  storagePath: process.env['ENGINE_DATA_STORAGE_PATH'] || './data',
  logLevel: process.env['ENGINE_DATA_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
};

export function loadDataConfig(overrides?: Partial<DataConfig>): DataConfig {
  return { ...DEFAULTS, ...overrides };
}
