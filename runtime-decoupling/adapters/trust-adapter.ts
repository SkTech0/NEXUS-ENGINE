/**
 * Trust adapter — process-boundary abstraction for engine-trust.
 * Calls in-process or remote trust service; API contract unchanged.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

export interface TrustVerifyInput {
  principalId: string;
  action?: string;
  resource?: string;
}

export interface TrustVerifyResult {
  allowed: boolean;
  reason?: string;
}

async function httpPost(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Trust adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

async function httpGet(baseUrl: string, path: string): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) throw new Error(`Trust adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

export class TrustAdapter {
  constructor(private baseUrl?: string) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private resolveBaseUrl(): string {
    if (this.baseUrl) return this.baseUrl;
    const discovered = discoverServiceBaseUrl('engine-trust');
    if (discovered) return discovered;
    return process.env['ENGINE_TRUST_BASE_URL'] || 'http://localhost:3006';
  }

  async verify(input: TrustVerifyInput): Promise<TrustVerifyResult> {
    const base = this.resolveBaseUrl();
    const out = await httpPost(base, '/api/verify', input) as TrustVerifyResult;
    return out;
  }

  async health(): Promise<unknown> {
    const base = this.resolveBaseUrl();
    return httpGet(base, '/api/health');
  }
}
