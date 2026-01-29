/**
 * AI adapter — process-boundary abstraction for engine-ai.
 * Calls in-process or remote AI service; API contract unchanged.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

export interface AIInferInput {
  modelId: string;
  inputs: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface AIInferResult {
  outputs: Record<string, unknown>;
  latency_ms?: number;
  model_id?: string;
}

async function httpPost(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`AI adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

export class AIAdapter {
  constructor(private baseUrl?: string) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private resolveBaseUrl(): string {
    if (this.baseUrl) return this.baseUrl;
    const discovered = discoverServiceBaseUrl('engine-ai');
    if (discovered) return discovered;
    return process.env['ENGINE_AI_BASE_URL'] || 'http://localhost:3002';
  }

  async infer(input: AIInferInput): Promise<AIInferResult> {
    const base = this.resolveBaseUrl();
    const out = await httpPost(base, '/api/infer', input) as AIInferResult;
    return out;
  }

  async health(): Promise<unknown> {
    const base = this.resolveBaseUrl();
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error(`AI adapter health: ${res.status}`);
    return res.json();
  }
}
