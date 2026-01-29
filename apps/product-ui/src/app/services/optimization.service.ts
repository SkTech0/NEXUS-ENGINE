import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OptimizationRequest {
  targetId?: string;
  objective?: string;
  constraints?: Record<string, number>;
}

export interface OptimizationResponse {
  targetId: string;
  value: number;
  feasible: boolean;
}

@Injectable({ providedIn: 'root' })
export class OptimizationService {
  private readonly baseUrl = environment?.apiUrl ?? '/api';

  constructor(private readonly http: HttpClient) {}

  optimize(request: OptimizationRequest): Observable<OptimizationResponse> {
    return this.http.post<OptimizationResponse>(
      `${this.baseUrl}/Optimization/optimize`,
      request
    );
  }
}
