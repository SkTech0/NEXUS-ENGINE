/**
 * Engine service wrapper — independent runtime for engine-core.
 * Uses engine adapter; lifecycle and health independent.
 */

import { EngineAdapter, type EngineExecuteInput, type EngineExecuteResult } from '../adapters/engine-adapter';
import { loadEngineConfig } from '../config/engine-config';
import { registerStartupHook } from '../lifecycle/startup';
import { registerShutdownHook } from '../lifecycle/shutdown';
import { registerHealthChecker } from '../lifecycle/health';
import { runHealthCheck } from '../lifecycle/health';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-core';

export class EngineService {
  private adapter: EngineAdapter;
  private config: ReturnType<typeof loadEngineConfig>;

  constructor(baseUrl?: string) {
    this.config = loadEngineConfig();
    this.adapter = new EngineAdapter(baseUrl);
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

  async execute(input: EngineExecuteInput): Promise<EngineExecuteResult> {
    return this.adapter.execute(input);
  }

  async status(): Promise<unknown> {
    return this.adapter.status();
  }

  getConfig(): ReturnType<typeof loadEngineConfig> {
    return this.config;
  }
}
