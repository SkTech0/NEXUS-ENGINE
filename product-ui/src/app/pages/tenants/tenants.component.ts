import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SaasApiService, Tenant, UsageSummaryItem } from '../../services/saas-api.service';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="tenants">
      <h2>Tenants</h2>
      <p class="intro">Backed by saas-layer (tenant manager + usage tracker) via SaaS API service.</p>

      @if (error) {
        <p class="error">{{ error }}</p>
      }

      @if (loading) {
        <p>Loading…</p>
      } @else {
        <ul class="tenant-list">
          @for (t of tenants; track t.id) {
            <li>
              <strong>{{ t.name }}</strong> ({{ t.id }}) — plan: {{ t.plan }}
              @if (usageByTenant[t.id]?.length) {
                <ul class="usage">
                  @for (u of usageByTenant[t.id]; track u.metric) {
                    <li>{{ u.metric }}: {{ u.total }} {{ u.unit }}</li>
                  }
                </ul>
              }
            </li>
          }
        </ul>
        @if (tenants.length === 0 && !error) {
          <p>No tenants yet. Start the SaaS API service and create one via API or add seed data.</p>
        }
      }

      <nav>
        <a routerLink="/">Back to landing</a>
      </nav>
    </section>
  `,
  styles: [
    `
      .tenants { margin: 1rem; max-width: 640px; }
      .intro { color: #666; margin-bottom: 1rem; }
      .error { color: #c00; }
      .tenant-list { list-style: none; padding: 0; }
      .tenant-list li { margin-bottom: 1rem; padding: 0.5rem; border: 1px solid #eee; border-radius: 4px; }
      .usage { list-style: circle; margin: 0.25rem 0 0 1rem; font-size: 0.9rem; color: #444; }
      nav { margin-top: 1.5rem; }
      nav a { color: #1976d2; }
    `,
  ],
})
export class TenantsComponent implements OnInit {
  tenants: Tenant[] = [];
  usageByTenant: Record<string, UsageSummaryItem[]> = {};
  loading = true;
  error: string | null = null;

  constructor(private readonly saas: SaasApiService) {}

  ngOnInit(): void {
    this.saas.listTenants().subscribe({
      next: (list) => {
        this.tenants = list;
        list.forEach((t) => {
          this.saas.getUsage(t.id).subscribe({
            next: (usage) => (this.usageByTenant[t.id] = usage),
            error: () => (this.usageByTenant[t.id] = []),
          });
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Failed to load tenants. Is the SaaS API service running on port 5001?';
        this.loading = false;
      },
    });
  }
}
