import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';

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
}

