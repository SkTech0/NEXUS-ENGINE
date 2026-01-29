import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoanHistoryService, LoanDecisionRecord } from '../services/loan-history.service';
import { LoanStateService } from '../services/loan-state.service';

@Component({
  selector: 'nexus-loan-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-history.component.html',
  styleUrl: './loan-history.component.scss',
})
export class LoanHistoryComponent {
  private readonly loanHistory = inject(LoanHistoryService);
  private readonly loanState = inject(LoanStateService);
  private readonly router = inject(Router);

  readonly records$ = this.loanHistory.records$;

  openRecord(record: LoanDecisionRecord): void {
    this.loanState.loadRecord(record);
    void this.router.navigateByUrl('/loan/decision');
  }

  formatTime(ms: number): string {
    try {
      return new Date(ms).toLocaleString();
    } catch {
      return String(ms);
    }
  }

  outcomeClass(outcome: string): string {
    if (outcome === 'APPROVED') return 'pill--approved';
    if (outcome === 'REJECTED') return 'pill--rejected';
    return 'pill--review';
  }

  clear(): void {
    this.loanHistory.clear();
  }
}
