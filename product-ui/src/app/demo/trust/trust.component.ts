import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EngineService, TrustHealthResponse } from '../services/engine.service';
import { StateService } from '../services/state.service';

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskIndicatorView {
  name: string;
  level: RiskLevel;
  message: string;
}

@Component({
  selector: 'nexus-trust',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trust.component.html',
  styleUrl: './trust.component.scss',
})
export class TrustComponent {
  private readonly engine = inject(EngineService);
  private readonly state = inject(StateService);

  readonly state$ = this.state.state$;

  loading = false;
  error: string | null = null;
  health: TrustHealthResponse | null = null;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.engine.trustHealth().subscribe({
      next: (res) => {
        this.health = res;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = err instanceof Error ? err.message : 'Unable to reach Trust service.';
        this.loading = false;
      },
    });
  }

  formatTimestamp(ms: number | null | undefined): string {
    if (ms == null || !Number.isFinite(ms)) return '—';
    try {
      return new Date(ms).toISOString();
    } catch {
      return String(ms);
    }
  }

  confidenceFrom(results: any): number | null {
    const c1 = results?.evaluate?.confidence;
    if (typeof c1 === 'number') return c1;
    const c2 = results?.infer?.confidence;
    if (typeof c2 === 'number') return c2;
    const c3 = this.health?.confidence;
    if (typeof c3 === 'number') return c3;
    return null;
  }

  indicatorsFrom(results: any): RiskIndicatorView[] {
    const apiIndicators = this.health?.indicators;
    if (Array.isArray(apiIndicators) && apiIndicators.length) {
      return apiIndicators.map((i) => ({
        name: i.name ?? 'Indicator',
        level: (i.level as RiskLevel) ?? 'medium',
        message: i.message ?? '',
      }));
    }

    const confidence = this.confidenceFrom(results);
    const confLevel: RiskLevel =
      typeof confidence !== 'number' ? 'medium' : confidence >= 0.75 ? 'low' : confidence >= 0.5 ? 'medium' : 'high';

    const stability: RiskLevel =
      this.state.snapshot.overallStatus === 'failed' ? 'high' : this.state.snapshot.overallStatus === 'running' ? 'medium' : 'low';

    return [
      {
        name: 'Confidence signal',
        level: confLevel,
        message:
          typeof confidence !== 'number'
            ? 'Confidence not provided. Review decision output for clarity.'
            : confidence >= 0.75
              ? 'High confidence. The system is comfortable with this outcome.'
              : confidence >= 0.5
                ? 'Moderate confidence. Consider a quick human review.'
                : 'Low confidence. Strongly consider human approval or alternate options.',
      },
      {
        name: 'Execution stability',
        level: stability,
        message:
          stability === 'high'
            ? 'A step reported an issue. Treat outputs as provisional.'
            : stability === 'medium'
              ? 'Execution is in progress. Some signals may still change.'
              : 'All steps completed without reported issues.',
      },
      {
        name: 'Risk posture',
        level: confLevel === 'high' || stability === 'high' ? 'high' : confLevel === 'medium' ? 'medium' : 'low',
        message: 'A single view combining confidence and execution stability for demo decisions.',
      },
    ];
  }
}

