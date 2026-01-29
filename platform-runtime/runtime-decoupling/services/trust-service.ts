/**
 * Trust service wrapper — independent runtime for engine-trust.
 * Uses trust adapter; lifecycle and health independent.
 */

import { TrustAdapter, type TrustVerifyInput, type TrustVerifyResult } from '../adapters/trust-adapter';
import { loadTrustConfig } from '../config/trust-config';
import { registerStartupHook } from '../lifecycle/startup';
import { registerShutdownHook } from '../lifecycle/shutdown';
import { registerHealthChecker } from '../lifecycle/health';
import { runHealthCheck } from '../lifecycle/health';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-trust';

export class TrustService {
  private adapter: TrustAdapter;
  private config: ReturnType<typeof loadTrustConfig>;

  constructor(baseUrl?: string) {
    this.config = loadTrustConfig();
    this.adapter = new TrustAdapter(baseUrl);
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

  async verify(input: TrustVerifyInput): Promise<TrustVerifyResult> {
    return this.adapter.verify(input);
  }

  async health(): Promise<unknown> {
    return this.adapter.health();
  }

  getConfig(): ReturnType<typeof loadTrustConfig> {
    return this.config;
  }
}
