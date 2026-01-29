/**
 * Optimization adapter — process-boundary abstraction for engine-optimization.
 * Calls in-process or remote optimization service; API contract unchanged.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

export interface OptimizationOptimizeInput {
  targetId: string;
  objective: string;
  constraints?: Record<string, unknown>;
}

export interface OptimizationOptimizeResult {
  success: boolean;
  result?: unknown;
}

async function httpPost(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Optimization adapter: ${res.status} ${res.statusText}`);
  return res.json();
}

export class OptimizationAdapter {
  constructor(private baseUrl?: string) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private resolveBaseUrl(): string {
    if (this.baseUrl) return this.baseUrl;
    const discovered = discoverServiceBaseUrl('engine-optimization');
    if (discovered) return discovered;
    return process.env['ENGINE_OPTIMIZATION_BASE_URL'] || 'http://localhost:3005';
  }

  async optimize(input: OptimizationOptimizeInput): Promise<OptimizationOptimizeResult> {
    const base = this.resolveBaseUrl();
    const out = await httpPost(base, '/api/optimize', input) as OptimizationOptimizeResult;
    return out;
  }

  async health(): Promise<unknown> {
    const base = this.resolveBaseUrl();
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error(`Optimization adapter health: ${res.status}`);
    return res.json();
  }
}
