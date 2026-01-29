/**
 * Engine gateway — routes to engine-core (or engine-api engine facet).
 * Process-boundary; independent deployment.
 */

import { EngineAdapter } from '../adapters/engine-adapter';
import { discoverServiceBaseUrl } from '../orchestration/discovery';

const ENGINE_CORE_NAME = 'engine-core';
const DEFAULT_ENGINE_BASE = process.env['ENGINE_CORE_BASE_URL'] || 'http://localhost:3001';

export class EngineGateway {
  private adapter: EngineAdapter;

  constructor(baseUrl?: string) {
    const url = baseUrl ?? discoverServiceBaseUrl(ENGINE_CORE_NAME) ?? DEFAULT_ENGINE_BASE;
    this.adapter = new EngineAdapter(url);
  }

  setBaseUrl(url: string): void {
    this.adapter.setBaseUrl(url);
  }

  async execute(action: string, parameters?: Record<string, unknown>): Promise<unknown> {
    return this.adapter.execute({ action, parameters });
  }

  async status(): Promise<unknown> {
    return this.adapter.status();
  }
}
