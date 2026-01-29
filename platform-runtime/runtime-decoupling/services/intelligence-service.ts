/**
 * Intelligence service wrapper — independent runtime for engine-intelligence.
 * Uses intelligence adapter; lifecycle and health independent.
 */

import {
  IntelligenceAdapter,
  type IntelligenceEvaluateInput,
  type IntelligenceEvaluateResult,
} from '../adapters/intelligence-adapter';
import { loadIntelligenceConfig } from '../config/intelligence-config';
import { registerStartupHook } from '../lifecycle/startup';
import { registerShutdownHook } from '../lifecycle/shutdown';
import { registerHealthChecker } from '../lifecycle/health';
import { runHealthCheck } from '../lifecycle/health';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-intelligence';

export class IntelligenceService {
  private adapter: IntelligenceAdapter;
  private config: ReturnType<typeof loadIntelligenceConfig>;

  constructor(baseUrl?: string) {
    this.config = loadIntelligenceConfig();
    this.adapter = new IntelligenceAdapter(baseUrl);
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

  async evaluate(input: IntelligenceEvaluateInput): Promise<IntelligenceEvaluateResult> {
    return this.adapter.evaluate(input);
  }

  async health(): Promise<unknown> {
    return this.adapter.health();
  }

  getConfig(): ReturnType<typeof loadIntelligenceConfig> {
    return this.config;
  }
}
