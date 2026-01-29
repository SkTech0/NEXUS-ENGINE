import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EngineExecuteResponse {
  status?: string;
  result?: unknown;
  message?: string;
}

export interface AiInferResponse {
  outputs?: Record<string, unknown>;
  latencyMs?: number;
  modelId?: string;
}

export interface OptimizationResponse {
  targetId?: string;
  value?: number;
  feasible?: boolean;
}

export interface IntelligenceEvaluateResponse {
  confidence?: number;
  outcome?: string;
  payload?: unknown;
}

export interface TrustHealthResponse {
  status?: string;
  healthy?: boolean;
  confidence?: number;
  indicators?: Array<{ name: string; level: 'low' | 'medium' | 'high'; message?: string }>;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class EngineService {
  // Use relative /api so Angular dev-server proxy can avoid CORS.
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  execute(payload: unknown): Observable<EngineExecuteResponse> {
    return this.http.post<EngineExecuteResponse>(`${this.baseUrl}/Engine/execute`, payload);
  }

  infer(payload: unknown): Observable<AiInferResponse> {
    return this.http.post<AiInferResponse>(`${this.baseUrl}/AI/infer`, payload);
  }

  optimize(payload: unknown): Observable<OptimizationResponse> {
    return this.http.post<OptimizationResponse>(`${this.baseUrl}/Optimization/optimize`, payload);
  }

  evaluate(payload: unknown): Observable<IntelligenceEvaluateResponse> {
    return this.http.post<IntelligenceEvaluateResponse>(`${this.baseUrl}/Intelligence/evaluate`, payload);
  }

  trustHealth(): Observable<TrustHealthResponse> {
    return this.http.get<TrustHealthResponse>(`${this.baseUrl}/Trust/health`);
  }
}

