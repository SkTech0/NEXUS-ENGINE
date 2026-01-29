/**
 * Trust gateway — routes to engine-trust.
 * Process-boundary; independent deployment.
 */

import { TrustAdapter } from '../adapters/trust-adapter';
import { discoverServiceBaseUrl } from '../orchestration/discovery';

const ENGINE_TRUST_NAME = 'engine-trust';
const DEFAULT_TRUST_BASE = process.env['ENGINE_TRUST_BASE_URL'] || 'http://localhost:3006';

export class TrustGateway {
  private adapter: TrustAdapter;

  constructor(baseUrl?: string) {
    const url = baseUrl ?? discoverServiceBaseUrl(ENGINE_TRUST_NAME) ?? DEFAULT_TRUST_BASE;
    this.adapter = new TrustAdapter(url);
  }

  setBaseUrl(url: string): void {
    this.adapter.setBaseUrl(url);
  }

  async verify(principalId: string, action?: string, resource?: string): Promise<unknown> {
    return this.adapter.verify({ principalId, action, resource });
  }

  async health(): Promise<unknown> {
    return this.adapter.health();
  }
}
