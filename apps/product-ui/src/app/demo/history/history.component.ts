import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HistoryService, DemoRunRecord } from '../services/history.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'nexus-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private readonly history = inject(HistoryService);
  private readonly state = inject(StateService);
  private readonly router = inject(Router);

  readonly runs$ = this.history.runs$;

  openRun(run: DemoRunRecord): void {
    this.state.loadRun(run);
    void this.router.navigateByUrl('/decision');
  }

  formatTime(ms: number): string {
    try {
      return new Date(ms).toLocaleString();
    } catch {
      return String(ms);
    }
  }

  clear(): void {
    this.history.clear();
  }
}

