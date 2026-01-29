import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EngineStatus {
  status: string;
  result?: unknown;
  message?: string;
}

export interface EngineExecuteRequest {
  action?: string;
  parameters?: Record<string, unknown>;
}

export interface EngineExecuteResponse {
  status: string;
  result?: unknown;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class EngineApiService {
  private readonly baseUrl = environment?.apiUrl ?? '/api';

  constructor(private readonly http: HttpClient) {}

  getStatus(): Observable<EngineStatus> {
    return this.http.get<EngineStatus>(`${this.baseUrl}/Engine`);
  }

  execute(request: EngineExecuteRequest): Observable<EngineExecuteResponse> {
    return this.http.post<EngineExecuteResponse>(`${this.baseUrl}/Engine/execute`, request);
  }
}
