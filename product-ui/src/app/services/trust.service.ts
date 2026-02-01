import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrustVerifyRequest {
  claimType?: string;
  payload?: unknown;
}

export interface TrustVerifyResponse {
  valid: boolean;
  message?: string;
}

export interface TrustScoreResponse {
  entityId: string;
  score: number;
  source?: string;
}

@Injectable({ providedIn: 'root' })
export class TrustService {
  private readonly baseUrl = environment?.apiUrl ?? '/api';

  constructor(private readonly http: HttpClient) {}

  verify(request: TrustVerifyRequest): Observable<TrustVerifyResponse> {
    return this.http.post<TrustVerifyResponse>(`${this.baseUrl}/Trust/verify`, request);
  }

  getScore(entityId: string): Observable<TrustScoreResponse> {
    return this.http.get<TrustScoreResponse>(`${this.baseUrl}/Trust/score/${entityId}`);
  }

  /** Fetch demo token from backend (signed with TRUST_JWT_SECRET). Falls back to client-side if unavailable. */
  getDemoToken(): Observable<{ token: string | null; message?: string }> {
    return this.http.get<{ token: string | null; message?: string }>(`${this.baseUrl}/Trust/demo-token`);
  }
}
