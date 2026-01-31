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
    const r = results as {
      evaluate?: { confidence?: number };
      infer?: { confidence?: number; outputs?: { confidence?: number } };
      trust?: { confidence?: number };
    } | undefined;
    const evalC = typeof r?.evaluate?.confidence === 'number' ? r.evaluate.confidence : null;
    const inferC =
      typeof r?.infer?.confidence === 'number'
        ? r.infer.confidence
        : typeof r?.infer?.outputs?.confidence === 'number'
          ? r.infer.outputs.confidence
          : null;
    const trustC = typeof r?.trust?.confidence === 'number' ? r.trust.confidence : null;
    const values = [evalC, inferC, trustC].filter((x): x is number => x != null);
    if (values.length === 0) return null;
    if (values.length === 1) return values[0] ?? null;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /** Confidence derivation explainability: which engine contributed. */
  confidenceSource(results: unknown): string {
    const r = results as {
      evaluate?: { confidence?: number };
      infer?: { confidence?: number; outputs?: { confidence?: number } };
      trust?: { confidence?: number };
    } | undefined;
    const hasEval = typeof r?.evaluate?.confidence === 'number';
    const hasInfer =
      typeof r?.infer?.confidence === 'number' || typeof r?.infer?.outputs?.confidence === 'number';
    const hasTrust = typeof r?.trust?.confidence === 'number';
    const parts: string[] = [];
    if (hasEval) parts.push('Intelligence Evaluation');
    if (hasInfer) parts.push('AI Inference');
    if (hasTrust) parts.push('Trust');
    if (parts.length === 0) return 'Not available from this run.';
    return parts.join(', ') + '.';
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

