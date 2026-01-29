/**
 * Data adapter — process-boundary abstraction for engine-data.
 * Calls in-process or remote data service; API contract unchanged.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

export interface DataGetInput {
  key: string;
  namespace?: string;
}

export interface DataPutInput {
  key: string;
  value: unknown;
  namespace?: string;
}

async function httpGet(baseUrl: string, path: string): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) throw new Error(`Data adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

async function httpPost(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Data adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

export class DataAdapter {
  constructor(private baseUrl?: string) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private resolveBaseUrl(): string {
    if (this.baseUrl) return this.baseUrl;
    const discovered = discoverServiceBaseUrl('engine-data');
    if (discovered) return discovered;
    return process.env['ENGINE_DATA_BASE_URL'] || 'http://localhost:3003';
  }

  async get(input: DataGetInput): Promise<unknown> {
    const base = this.resolveBaseUrl();
    const q = new URLSearchParams({ key: input.key });
    if (input.namespace) q.set('namespace', input.namespace);
    return httpGet(base, `/api/get?${q.toString()}`);
  }

  async put(input: DataPutInput): Promise<unknown> {
    const base = this.resolveBaseUrl();
    return httpPost(base, '/api/put', input);
  }

  async health(): Promise<unknown> {
    const base = this.resolveBaseUrl();
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error(`Data adapter health: ${res.status}`);
    return res.json();
  }
}
