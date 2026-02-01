import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  active: boolean;
  metadata?: Record<string, unknown>;
}

export interface UsageSummaryItem {
  tenant_id: string;
  metric: string;
  total: number;
  unit: string;
}

@Injectable({ providedIn: 'root' })
export class SaasApiService {
  private readonly baseUrl =
    (environment as { saasApiUrl?: string })?.saasApiUrl?.replace(/^__SAAS_API_URL__$/, '/api/saas') ?? '/api/saas';

  constructor(private readonly http: HttpClient) {}

  listTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.baseUrl}/tenants`);
  }

  createTenant(id: string, name: string, plan: string = 'default'): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.baseUrl}/tenants`, { id, name, plan });
  }

  getTenant(tenantId: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.baseUrl}/tenants/${tenantId}`);
  }

  getUsage(tenantId: string): Observable<UsageSummaryItem[]> {
    return this.http.get<UsageSummaryItem[]>(`${this.baseUrl}/tenants/${tenantId}/usage`);
  }

  recordUsage(
    tenantId: string,
    metric: string,
    value: number,
    unit: string = 'count'
  ): Observable<{ tenant_id: string; metric: string; value: number; unit: string }> {
    return this.http.post<{ tenant_id: string; metric: string; value: number; unit: string }>(
      `${this.baseUrl}/tenants/${tenantId}/usage`,
      { metric, value, unit }
    );
  }
}
