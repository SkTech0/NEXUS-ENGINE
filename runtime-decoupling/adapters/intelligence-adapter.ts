/**
 * Intelligence adapter — process-boundary abstraction for engine-intelligence.
 * Calls in-process or remote intelligence service; API contract unchanged.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

export interface IntelligenceEvaluateInput {
  context: string;
  inputs: Record<string, unknown>;
}

export interface IntelligenceEvaluateResult {
  outcome: string;
  confidence: number;
  payload?: unknown;
}

async function httpPost(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Intelligence adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

export class IntelligenceAdapter {
  constructor(private baseUrl?: string) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private resolveBaseUrl(): string {
    if (this.baseUrl) return this.baseUrl;
    const discovered = discoverServiceBaseUrl('engine-intelligence');
    if (discovered) return discovered;
    return process.env['ENGINE_INTELLIGENCE_BASE_URL'] || 'http://localhost:3004';
  }

  async evaluate(input: IntelligenceEvaluateInput): Promise<IntelligenceEvaluateResult> {
    const base = this.resolveBaseUrl();
    const out = await httpPost(base, '/api/evaluate', input) as IntelligenceEvaluateResult;
    return out;
  }

  async health(): Promise<unknown> {
    const base = this.resolveBaseUrl();
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error(`Intelligence adapter health: ${res.status}`);
    return res.json();
  }
}
