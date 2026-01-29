import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptimizationService, OptimizationResponse } from '../../services/optimization.service';

@Component({
  selector: 'app-optimization-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './optimization-viewer.component.html',
  styleUrl: './optimization-viewer.component.scss',
})
export class OptimizationViewerComponent {
  targetId = 'default';
  result: OptimizationResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(private readonly optimizationService: OptimizationService) {}

  runOptimization(): void {
    this.loading = true;
    this.error = null;
    this.result = null;
    this.optimizationService.optimize({ targetId: this.targetId }).subscribe({
next: (r: OptimizationResponse) => {
          this.result = r;
          this.loading = false;
        },
        error: (err: { message?: string }) => {
          this.error = err?.message ?? 'Optimization request failed';
        this.loading = false;
      },
    });
  }
}
