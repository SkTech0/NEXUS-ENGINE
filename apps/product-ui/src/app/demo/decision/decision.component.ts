import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';

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

  confidenceFrom(results: any): number | null {
    const c1 = results?.evaluate?.confidence;
    if (typeof c1 === 'number') return c1;
    const c2 = results?.infer?.confidence;
    if (typeof c2 === 'number') return c2;
    return null;
  }
}

