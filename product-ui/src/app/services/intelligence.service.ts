import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IntelligenceEvaluateRequest {
  context?: string;
  inputs?: Record<string, unknown>;
}

export interface IntelligenceEvaluateResponse {
  outcome: string;
  confidence: number;
  payload?: unknown;
}

@Injectable({ providedIn: 'root' })
export class IntelligenceService {
  private readonly baseUrl = environment?.apiUrl ?? '/api';

  constructor(private readonly http: HttpClient) {}

  evaluate(request: IntelligenceEvaluateRequest): Observable<IntelligenceEvaluateResponse> {
    return this.http.post<IntelligenceEvaluateResponse>(
      `${this.baseUrl}/Intelligence/evaluate`,
      request
    );
  }
}
