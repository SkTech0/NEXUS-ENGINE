import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService, type DemoRunState, type DemoStep } from '../services/state.service';

@Component({
  selector: 'nexus-decision',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './decision.component.html',
  styleUrl: './decision.component.scss',
})
export class DecisionComponent {
  private readonly state = inject(StateService);
  readonly state$ = this.state.state$;

  pretty(value: unknown): string {
    if (value == null) return '—';
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  confidenceFrom(results: unknown): number | null {
    const r = results as { evaluate?: { confidence?: number }; infer?: { confidence?: number } } | undefined;
    if (typeof r?.evaluate?.confidence === 'number') return r.evaluate.confidence;
    if (typeof r?.infer?.confidence === 'number') return r.infer.confidence;
    return null;
  }

  /** Confidence derivation explainability: which engine contributed. */
  confidenceSource(results: unknown): string {
    const r = results as { evaluate?: { confidence?: number }; infer?: { confidence?: number } } | undefined;
    if (typeof r?.evaluate?.confidence === 'number' && typeof r?.infer?.confidence === 'number')
      return 'Intelligence Evaluation and AI Inference.';
    if (typeof r?.evaluate?.confidence === 'number') return 'Intelligence Evaluation.';
    if (typeof r?.infer?.confidence === 'number') return 'AI Inference.';
    return 'Not available from this run.';
  }

  /** Partial success: at least one step succeeded and at least one failed. */
  isPartialSuccess(s: DemoRunState): boolean {
    const hasSuccess = s.steps?.some((st) => st.status === 'success') ?? false;
    const hasError = s.steps?.some((st) => st.status === 'error') ?? false;
    return hasSuccess && hasError;
  }

  formatTimestamp(ms: number | null | undefined): string {
    if (ms == null || !Number.isFinite(ms)) return '—';
    try {
      return new Date(ms).toISOString();
    } catch {
      return String(ms);
    }
  }

  stepOrder(s: DemoRunState): string[] {
    return (s.steps ?? []).map((st: DemoStep) => `${st.id} (${st.status})`);
  }

  hasRunData(s: DemoRunState): boolean {
    return (s.runId != null && s.createdAt != null) || Object.keys(s.results ?? {}).length > 0;
  }
}

