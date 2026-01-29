import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';

type InputMode = 'structured' | 'json';

@Component({
  selector: 'nexus-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent {
  mode: InputMode = 'structured';

  title = 'Demo Scenario';
  goal = 'Make a recommendation for the best next action.';
  constraints = 'Budget: 1000\nLatency: < 200ms\nRisk tolerance: Medium';
  notes = 'Customer is price-sensitive and values reliability.';

  jsonText = JSON.stringify(
    {
      scenario: 'Demo Scenario',
      goal: 'Make a recommendation for the best next action.',
      constraints: [{ name: 'Budget', value: 1000 }, { name: 'LatencyMs', value: 200 }, { name: 'RiskTolerance', value: 'Medium' }],
      context: { user: { segment: 'SMB' }, preferences: ['reliability', 'cost'] },
    },
    null,
    2
  );

  jsonError: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly state: StateService
  ) {}

  onToggleMode(next: InputMode): void {
    this.mode = next;
    this.jsonError = null;
  }

  run(): void {
    const payload = this.mode === 'json' ? this.parseJson() : this.buildStructuredPayload();
    if (!payload) return;

    this.state.reset();
    this.state.startRun(payload, this.title);
    void this.router.navigateByUrl('/evaluate');
  }

  private parseJson(): unknown | null {
    this.jsonError = null;
    try {
      const parsed = JSON.parse(this.jsonText);
      return parsed;
    } catch {
      this.jsonError = 'Please enter valid JSON.';
      return null;
    }
  }

  private buildStructuredPayload(): unknown {
    const constraints = this.constraints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      scenario: this.title?.trim() || 'Demo Scenario',
      goal: this.goal?.trim() || undefined,
      constraints,
      notes: this.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
  }
}

