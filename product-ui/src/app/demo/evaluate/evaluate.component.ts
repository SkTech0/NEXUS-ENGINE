import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService, type DemoRunState, type DemoStep } from '../services/state.service';

@Component({
  selector: 'nexus-evaluate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './evaluate.component.html',
  styleUrl: './evaluate.component.scss',
})
export class EvaluateComponent {
  private readonly state = inject(StateService);
  readonly state$ = this.state.state$;

  progress(steps: Array<{ status: string }>): number {
    if (!steps?.length) return 0;
    const done = steps.filter((s) => s.status === 'success').length;
    return Math.round((done / steps.length) * 100);
  }

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

  hasRun(s: DemoRunState): boolean {
    return s.runId != null || (s.steps?.length ?? 0) > 0;
  }
}

