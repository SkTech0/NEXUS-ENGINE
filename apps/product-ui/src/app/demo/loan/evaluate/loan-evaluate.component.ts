import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoanStateService } from '../services/loan-state.service';

@Component({
  selector: 'nexus-loan-evaluate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-evaluate.component.html',
  styleUrl: './loan-evaluate.component.scss',
})
export class LoanEvaluateComponent {
  private readonly loanState = inject(LoanStateService);
  readonly state$ = this.loanState.state$;

  progress(steps: Array<{ status: string }>): number {
    if (!steps?.length) return 0;
    const done = steps.filter((s) => s.status === 'success').length;
    return Math.round((done / steps.length) * 100);
  }
}
