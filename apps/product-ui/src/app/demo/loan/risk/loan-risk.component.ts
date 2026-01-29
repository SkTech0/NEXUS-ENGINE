import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EngineService, TrustHealthResponse } from '../../services/engine.service';
import { LoanStateService } from '../services/loan-state.service';
import { LoanApplication } from '../models/loan-application.model';

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskIndicatorView {
  name: string;
  level: RiskLevel;
  message: string;
}

@Component({
  selector: 'nexus-loan-risk',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-risk.component.html',
  styleUrl: './loan-risk.component.scss',
})
export class LoanRiskComponent {
  private readonly engine = inject(EngineService);
  private readonly loanState = inject(LoanStateService);

  readonly state$ = this.loanState.state$;

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
      error: () => {
        this.error = 'Unable to reach Trust service.';
        this.loading = false;
      },
    });
  }

  confidenceFrom(results: unknown, domainConfidence?: number | null): number | null {
    const r = (results as { execute?: unknown; infer?: unknown; evaluate?: unknown; optimize?: unknown; trust?: unknown }) ?? {};
    const derived = this.loanState.deriveConfidence(r, domainConfidence);
    if (typeof derived === 'number') return derived;
    const c3 = this.health?.confidence;
    if (typeof c3 === 'number') return c3;
    return null;
  }

  riskScoreFrom(results: unknown, application?: LoanApplication | null, domainRiskScore?: number | null): number | null {
    return this.loanState.deriveRiskScore(
      (results as { execute?: unknown; infer?: unknown; evaluate?: unknown; optimize?: unknown; trust?: unknown }) ?? {},
      application,
      domainRiskScore
    );
  }

  indicatorsFrom(results: unknown, domainConfidence?: number | null): RiskIndicatorView[] {
    const apiIndicators = this.health?.indicators;
    if (Array.isArray(apiIndicators) && apiIndicators.length) {
      return apiIndicators.map((i) => ({
        name: i.name ?? 'Indicator',
        level: (i.level as RiskLevel) ?? 'medium',
        message: i.message ?? '',
      }));
    }

    const confidence = this.confidenceFrom(results, domainConfidence);
    const confLevel: RiskLevel =
      typeof confidence !== 'number' ? 'medium' : confidence >= 0.75 ? 'low' : confidence >= 0.5 ? 'medium' : 'high';

    const status = this.loanState.snapshot.overallStatus;
    const stability: RiskLevel = status === 'failed' ? 'high' : status === 'running' ? 'medium' : 'low';

    return [
      {
        name: 'Confidence signal',
        level: confLevel,
        message:
          typeof confidence !== 'number'
            ? 'Confidence not yet available. Run an evaluation to see confidence.'
            : confidence >= 0.75
              ? 'High confidence. The system is comfortable with this outcome.'
              : confidence >= 0.5
                ? 'Moderate confidence. Consider a quick human review.'
                : 'Low confidence. We recommend human approval or alternate options.',
      },
      {
        name: 'Execution stability',
        level: stability,
        message:
          stability === 'high'
            ? 'A step reported an issue. Treat outputs as provisional.'
            : stability === 'medium'
              ? 'Evaluation is in progress. Some signals may still change.'
              : 'All steps completed without reported issues.',
      },
      {
        name: 'Risk posture',
        level: confLevel === 'high' || stability === 'high' ? 'high' : confLevel === 'medium' ? 'medium' : 'low',
        message: 'Combined view of confidence and execution stability for this loan decision.',
      },
    ];
  }
}
