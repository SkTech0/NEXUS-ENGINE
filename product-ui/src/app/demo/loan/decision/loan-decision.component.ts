import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoanStateService } from '../services/loan-state.service';
import { LoanApplication, LoanDecisionOutcome } from '../models/loan-application.model';

@Component({
  selector: 'nexus-loan-decision',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-decision.component.html',
  styleUrl: './loan-decision.component.scss',
})
export class LoanDecisionComponent {
  private readonly loanState = inject(LoanStateService);
  readonly state$ = this.loanState.state$;

  outcome(results: unknown, application?: LoanApplication | null, domainOutcome?: LoanDecisionOutcome | null): LoanDecisionOutcome {
    return this.loanState.deriveOutcome(
      (results as { execute?: unknown; infer?: unknown; evaluate?: unknown; optimize?: unknown; trust?: unknown }) ?? {},
      application,
      domainOutcome
    );
  }

  confidenceFrom(results: unknown, domainConfidence?: number | null): number | null {
    const r = (results as { execute?: unknown; infer?: unknown; evaluate?: unknown; optimize?: unknown; trust?: unknown }) ?? {};
    return this.loanState.deriveConfidence(r, domainConfidence);
  }

  riskScoreFrom(results: unknown, application?: LoanApplication | null, domainRiskScore?: number | null): number | null {
    return this.loanState.deriveRiskScore(
      (results as { execute?: unknown; infer?: unknown; evaluate?: unknown; optimize?: unknown; trust?: unknown }) ?? {},
      application,
      domainRiskScore
    );
  }

  reasonsFrom(results: unknown, application?: LoanApplication | null, outcome?: LoanDecisionOutcome): string[] {
    const r = results as { evaluate?: { payload?: { reasons?: string[] } }; infer?: { outputs?: { reasons?: string[] } } } | undefined;
    const fromEval = r?.evaluate?.payload?.reasons;
    if (Array.isArray(fromEval) && fromEval.length) return fromEval;
    const fromInfer = r?.infer?.outputs?.reasons;
    if (Array.isArray(fromInfer) && fromInfer.length) return fromInfer;
    return this.deriveReasons(application, outcome);
  }

  conditionsFrom(results: unknown, application?: LoanApplication | null, outcome?: LoanDecisionOutcome): string[] {
    const r = results as { evaluate?: { payload?: { conditions?: string[] } } } | undefined;
    const cond = r?.evaluate?.payload?.conditions;
    if (Array.isArray(cond) && cond.length) return cond;
    return this.deriveConditions(application, outcome);
  }

  suggestedActionsFrom(results: unknown, application?: LoanApplication | null, outcome?: LoanDecisionOutcome): string[] {
    const r = results as { evaluate?: { payload?: { suggestedActions?: string[] } }; infer?: { outputs?: { suggestedActions?: string[] } } } | undefined;
    const fromEval = r?.evaluate?.payload?.suggestedActions;
    if (Array.isArray(fromEval) && fromEval.length) return fromEval;
    const fromInfer = r?.infer?.outputs?.suggestedActions;
    if (Array.isArray(fromInfer) && fromInfer.length) return fromInfer;
    return this.deriveSuggestedActions(application, outcome);
  }

  private deriveReasons(app?: LoanApplication | null, outcome?: LoanDecisionOutcome): string[] {
    const reasons: string[] = [];
    if (!app) return ['Decision based on applicant profile, credit, income, and risk assessment.'];
    reasons.push(`Credit score: ${app.creditScore} (${app.creditScore >= 750 ? 'excellent' : app.creditScore >= 600 ? 'fair to good' : 'below threshold'}).`);
    if (app.income > 0) {
      const ratio = (app.loanAmount / app.income) * 100;
      reasons.push(`Income-to-loan ratio: ${ratio.toFixed(1)}% (${ratio <= 30 ? 'healthy' : ratio <= 50 ? 'moderate' : 'elevated'}).`);
    }
    if (app.existingLoans > 0) reasons.push(`Existing loans: ${app.existingLoans}.`);
    reasons.push(`Employment: ${app.employmentType}.`);
    if (outcome === 'APPROVED') reasons.push('Profile meets approval criteria with acceptable risk.');
    else if (outcome === 'REJECTED') reasons.push('Risk or eligibility thresholds not met.');
    else reasons.push('Manual review recommended to confirm eligibility.');
    return reasons.length ? reasons : ['Decision based on applicant profile, credit, income, and risk assessment.'];
  }

  private deriveConditions(app?: LoanApplication | null, outcome?: LoanDecisionOutcome): string[] {
    if (!app) return [];
    const conditions: string[] = [];
    if (outcome === 'APPROVED') {
      conditions.push('Documentation to be verified per policy.');
      if (app.loanAmount > 50000) conditions.push('Large loan: additional verification may apply.');
    } else if (outcome === 'REVIEW') {
      conditions.push('Human review required before final decision.');
      if (app.creditScore < 700) conditions.push('Credit score below preferred range.');
    } else {
      if (app.creditScore < 600) conditions.push('Credit score below minimum threshold.');
      conditions.push('Applicant may reapply after improving eligibility.');
    }
    return conditions;
  }

  private deriveSuggestedActions(app?: LoanApplication | null, outcome?: LoanDecisionOutcome): string[] {
    if (!app) return [];
    if (outcome === 'APPROVED') return ['Proceed with documentation and disbursement process.'];
    if (outcome === 'REVIEW') return ['Route to underwriting for manual review.', 'Verify income and employment if not already done.'];
    return [
      'Inform applicant of decision and reasons.',
      'Suggest improving credit score or reducing debt before reapplying.',
      'Offer alternative products if applicable.',
    ];
  }

  pretty(value: unknown): string {
    if (value == null) return '—';
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  formatTimestamp(ms: number | null | undefined): string {
    if (ms == null || !Number.isFinite(ms)) return '—';
    try {
      return new Date(ms).toISOString();
    } catch {
      return String(ms);
    }
  }

  hasRunData(s: { runId: string | null; createdAt: number | null; results: Record<string, unknown> }): boolean {
    return (s.runId != null && s.createdAt != null) || Object.keys(s.results ?? {}).length > 0;
  }
}
