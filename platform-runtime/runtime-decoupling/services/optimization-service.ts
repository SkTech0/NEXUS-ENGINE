/**
 * Optimization service wrapper — independent runtime for engine-optimization.
 * Uses optimization adapter; lifecycle and health independent.
 */

import {
  OptimizationAdapter,
  type OptimizationOptimizeInput,
  type OptimizationOptimizeResult,
} from '../adapters/optimization-adapter';
import { loadOptimizationConfig } from '../config/optimization-config';
import { registerStartupHook } from '../lifecycle/startup';
import { registerShutdownHook } from '../lifecycle/shutdown';
import { registerHealthChecker } from '../lifecycle/health';
import { runHealthCheck } from '../lifecycle/health';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-optimization';

export class OptimizationService {
  private adapter: OptimizationAdapter;
  private config: ReturnType<typeof loadOptimizationConfig>;

  constructor(baseUrl?: string) {
    this.config = loadOptimizationConfig();
    this.adapter = new OptimizationAdapter(baseUrl);
    if (baseUrl) this.adapter.setBaseUrl(baseUrl);
  }

  async start(): Promise<void> {
    registerStartupHook(async () => {
      const base = `http://${this.config.host}:${this.config.port}`;
      registerService(SERVICE_NAME, base, this.config.port);
    });
    registerHealthChecker(async () => runHealthCheck(SERVICE_NAME));
    registerShutdownHook(async () => {});
  }

  async optimize(input: OptimizationOptimizeInput): Promise<OptimizationOptimizeResult> {
    return this.adapter.optimize(input);
  }

  async health(): Promise<unknown> {
    return this.adapter.health();
  }

  getConfig(): ReturnType<typeof loadOptimizationConfig> {
    return this.config;
  }
}
