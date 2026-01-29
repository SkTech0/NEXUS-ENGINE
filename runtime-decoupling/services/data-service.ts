/**
 * Data service wrapper — independent runtime for engine-data.
 * Uses data adapter; lifecycle and health independent.
 */

import { DataAdapter, type DataGetInput, type DataPutInput } from '../adapters/data-adapter';
import { loadDataConfig } from '../config/data-config';
import { registerStartupHook } from '../lifecycle/startup';
import { registerShutdownHook } from '../lifecycle/shutdown';
import { registerHealthChecker } from '../lifecycle/health';
import { runHealthCheck } from '../lifecycle/health';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-data';

export class DataService {
  private adapter: DataAdapter;
  private config: ReturnType<typeof loadDataConfig>;

  constructor(baseUrl?: string) {
    this.config = loadDataConfig();
    this.adapter = new DataAdapter(baseUrl);
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

  async get(input: DataGetInput): Promise<unknown> {
    return this.adapter.get(input);
  }

  async put(input: DataPutInput): Promise<unknown> {
    return this.adapter.put(input);
  }

  async health(): Promise<unknown> {
    return this.adapter.health();
  }

  getConfig(): ReturnType<typeof loadDataConfig> {
    return this.config;
  }
}
