/**
 * AI service wrapper — independent runtime for engine-ai.
 * Uses AI adapter; lifecycle and health independent.
 */

import { AIAdapter, type AIInferInput, type AIInferResult } from '../adapters/ai-adapter';
import { loadAIConfig } from '../config/ai-config';
import { registerStartupHook } from '../lifecycle/startup';
import { registerShutdownHook } from '../lifecycle/shutdown';
import { registerHealthChecker } from '../lifecycle/health';
import { runHealthCheck } from '../lifecycle/health';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-ai';

export class AIService {
  private adapter: AIAdapter;
  private config: ReturnType<typeof loadAIConfig>;

  constructor(baseUrl?: string) {
    this.config = loadAIConfig();
    this.adapter = new AIAdapter(baseUrl);
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

  async infer(input: AIInferInput): Promise<AIInferResult> {
    return this.adapter.infer(input);
  }

  async health(): Promise<unknown> {
    return this.adapter.health();
  }

  getConfig(): ReturnType<typeof loadAIConfig> {
    return this.config;
  }
}
