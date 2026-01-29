/**
 * Per-engine config loader for engine-optimization.
 * Independent config, no shared state.
 */

export interface OptimizationConfig {
  name: string;
  port: number;
  host: string;
  pythonPath: string;
  modulePath: string;
  logLevel: string;
  env: string;
}

const DEFAULTS: OptimizationConfig = {
  name: 'engine-optimization',
  port: Number(process.env['ENGINE_OPTIMIZATION_PORT']) || 3005,
  host: process.env['ENGINE_OPTIMIZATION_HOST'] || '0.0.0.0',
  pythonPath: process.env['ENGINE_OPTIMIZATION_PYTHON_PATH'] || 'python3',
  modulePath: process.env['ENGINE_OPTIMIZATION_MODULE_PATH'] || 'engine-optimization',
  logLevel: process.env['ENGINE_OPTIMIZATION_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
};

export function loadOptimizationConfig(overrides?: Partial<OptimizationConfig>): OptimizationConfig {
  return { ...DEFAULTS, ...overrides };
}
