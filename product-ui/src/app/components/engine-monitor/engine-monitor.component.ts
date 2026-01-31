import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineApiService, EngineStatus, EngineExecuteResponse } from '../../services/engine-api.service';

@Component({
  selector: 'app-engine-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './engine-monitor.component.html',
  styleUrl: './engine-monitor.component.scss',
})
export class EngineMonitorComponent implements OnInit {
  status: EngineStatus | null = null;
  executeResult: EngineExecuteResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(private readonly engineApi: EngineApiService) {}

  ngOnInit(): void {
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.loading = true;
    this.error = null;
    this.engineApi.getStatus().subscribe({
      next: (s) => {
        this.status = s;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = err instanceof Error ? err.message : 'Failed to load status';
        this.loading = false;
      },
    });
  }

  execute(): void {
    this.loading = true;
    this.error = null;
    this.engineApi.execute({ action: 'ping', parameters: {} }).subscribe({
      next: (r) => {
        this.executeResult = r;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = err instanceof Error ? err.message : 'Execute failed';
        this.loading = false;
      },
    });
  }
}
