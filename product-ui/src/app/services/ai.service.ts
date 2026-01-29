import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AIInferenceRequest {
  modelId: string;
  inputs?: Record<string, unknown>;
}

export interface AIInferenceResponse {
  outputs: Record<string, unknown>;
  latencyMs: number;
  modelId: string;
}

export interface AIModelsResponse {
  modelIds: string[];
}

@Injectable({ providedIn: 'root' })
export class AIService {
  private readonly baseUrl = environment?.apiUrl ?? '/api';

  constructor(private readonly http: HttpClient) {}

  infer(request: AIInferenceRequest): Observable<AIInferenceResponse> {
    return this.http.post<AIInferenceResponse>(`${this.baseUrl}/AI/infer`, request);
  }

  listModels(): Observable<AIModelsResponse> {
    return this.http.get<AIModelsResponse>(`${this.baseUrl}/AI/models`);
  }
}
