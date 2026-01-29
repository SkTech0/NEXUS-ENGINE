/**
 * Engine adapter — process-boundary abstraction for engine-core.
 * Calls in-process or remote engine; API contract unchanged.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

export interface EngineExecuteInput {
  action: string;
  parameters?: Record<string, unknown>;
}

export interface EngineExecuteResult {
  success: boolean;
  payload?: unknown;
}

async function httpPost(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Engine adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

async function httpGet(baseUrl: string, path: string): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) throw new Error(`Engine adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

export class EngineAdapter {
  constructor(private baseUrl?: string) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private resolveBaseUrl(): string {
    if (this.baseUrl) return this.baseUrl;
    const discovered = discoverServiceBaseUrl('engine-core');
    if (discovered) return discovered;
    return process.env['ENGINE_CORE_BASE_URL'] || 'http://localhost:3001';
  }

  async execute(input: EngineExecuteInput): Promise<EngineExecuteResult> {
    const base = this.resolveBaseUrl();
    const out = await httpPost(base, '/api/execute', input) as EngineExecuteResult;
    return out;
  }

  async status(): Promise<unknown> {
    const base = this.resolveBaseUrl();
    return httpGet(base, '/api/status');
  }
}
