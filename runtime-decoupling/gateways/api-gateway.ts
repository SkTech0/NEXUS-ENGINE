/**
 * API gateway — routes to engine-api or downstream services.
 * Process-boundary; independent deployment.
 */

import { discoverServiceBaseUrl } from '../orchestration/discovery';

const ENGINE_API_NAME = 'engine-api';
const DEFAULT_API_BASE = process.env['ENGINE_API_BASE_URL'] || 'http://localhost:5000';

async function fetchJson(baseUrl: string, path: string, init?: RequestInit): Promise<unknown> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API gateway: ${res.status} ${res.statusText}`);
  return res.json();
}

export class ApiGateway {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? discoverServiceBaseUrl(ENGINE_API_NAME) ?? DEFAULT_API_BASE;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  async health(): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/Health');
  }

  async engineStatus(): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/Engine');
  }

  async engineExecute(body: { action: string; parameters?: Record<string, unknown> }): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/Engine/execute', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async intelligenceEvaluate(body: { context: string; inputs: Record<string, unknown> }): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/Intelligence/evaluate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async optimizationOptimize(body: { targetId: string; objective: string; constraints?: Record<string, unknown> }): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/Optimization/optimize', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async aiInfer(body: { modelId: string; inputs: Record<string, unknown> }): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/AI/infer', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async trustHealth(): Promise<unknown> {
    return fetchJson(this.baseUrl, '/api/Trust/health');
  }
}
