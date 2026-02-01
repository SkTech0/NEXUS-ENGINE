import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EngineService, TrustHealthResponse } from '../services/engine.service';
import { StateService } from '../services/state.service';
import { TrustService, TrustVerifyResponse } from '../../services/trust.service';
import { generateDemoJwt } from '../../services/jwt-demo.util';

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskIndicatorView {
  name: string;
  level: RiskLevel;
  message: string;
}

@Component({
  selector: 'nexus-trust',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trust.component.html',
  styleUrl: './trust.component.scss',
})
export class TrustComponent {
  private readonly engine = inject(EngineService);
  private readonly state = inject(StateService);
  private readonly trustService = inject(TrustService);

  readonly state$ = this.state.state$;

  loading = false;
  error: string | null = null;
  health: TrustHealthResponse | null = null;

  /** JWT Verify section */
  tokenInput = '';
  verifyLoading = false;
  verifyResult: TrustVerifyResponse | null = null;
  /** True when token came from client-side fallback (dev-demo-secret), not backend */
  tokenFromFallback = false;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.engine.trustHealth().subscribe({
      next: (res) => {
        this.health = res;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = err instanceof Error ? err.message : 'Unable to reach Trust service.';
        this.loading = false;
      },
    });
  }

  generateSampleJwt(): void {
    this.verifyResult = null;
    this.tokenFromFallback = false;
    // Try API first (uses TRUST_JWT_SECRET — works in prod). Fallback to client-side (dev-demo-secret).
    this.trustService.getDemoToken().subscribe({
      next: (res) => {
        if (res.token) {
          this.tokenInput = res.token;
          this.tokenFromFallback = false;
          return;
        }
        this.useFallbackToken();
      },
      error: () => this.useFallbackToken(),
    });
  }

  private useFallbackToken(): void {
    this.tokenFromFallback = true;
    generateDemoJwt()
      .then((token) => {
        this.tokenInput = token;
      })
      .catch(() => {
        this.verifyResult = { valid: false, message: 'Failed to generate demo JWT' };
      });
  }

  verifyToken(): void {
    const token = this.tokenInput?.trim();
    if (!token) {
      this.verifyResult = { valid: false, message: 'Paste or generate a token first' };
      return;
    }
    this.verifyLoading = true;
    this.verifyResult = null;
    this.trustService
      .verify({ payload: { token } })
      .subscribe({
        next: (res) => {
          this.verifyResult = res;
          this.verifyLoading = false;
        },
        error: (err: unknown) => {
          this.verifyResult = {
            valid: false,
            message: err instanceof Error ? err.message : 'Request failed',
          };
          this.verifyLoading = false;
        },
      });
  }

  /** Hint when Invalid signature + token was from fallback */
  get invalidSignatureHint(): string | null {
    if (
      !this.verifyResult ||
      this.verifyResult.valid ||
      !this.verifyResult.message?.toLowerCase().includes('invalid signature')
    ) {
      return null;
    }
    if (this.tokenFromFallback) {
      return 'Token was generated in the browser (dev-demo-secret). Set TRUST_JWT_SECRET=dev-demo-secret on engine-trust to verify, or ensure the demo-token API works (redeploy engine-trust with TRUST_JWT_SECRET).';
    }
    return 'Ensure engine-trust has TRUST_JWT_SECRET set and matches the signing secret.';
  }

  formatTimestamp(ms: number | null | undefined): string {
    if (ms == null || !Number.isFinite(ms)) return '—';
    try {
      return new Date(ms).toISOString();
    } catch {
      return String(ms);
    }
  }

  /** Trust confidence captured at pipeline execution time (from run snapshot). */
  trustAtDecisionTime(results: unknown): number | null {
    const c = (results as { trust?: { confidence?: number } })?.trust?.confidence;
    return typeof c === 'number' ? c : null;
  }

  /** Live trust confidence from /api/Trust/health (time-dependent). */
  get currentTrustConfidence(): number | null {
    const c = this.health?.confidence;
    return typeof c === 'number' ? c : null;
  }

  /** For indicators: prefer live trust when available, else trust-at-decision, else null. */
  trustConfidenceForIndicators(results: unknown): number | null {
    const live = this.currentTrustConfidence;
    if (live != null) return live;
    return this.trustAtDecisionTime(results);
  }

  indicatorsFrom(results: any): RiskIndicatorView[] {
    const apiIndicators = this.health?.indicators;
    if (Array.isArray(apiIndicators) && apiIndicators.length) {
      return apiIndicators.map((i) => ({
        name: i.name ?? 'Indicator',
        level: (i.level as RiskLevel) ?? 'medium',
        message: i.message ?? '',
      }));
    }

    const confidence = this.trustConfidenceForIndicators(results);
    const confLevel: RiskLevel =
      typeof confidence !== 'number' ? 'medium' : confidence >= 0.75 ? 'low' : confidence >= 0.5 ? 'medium' : 'high';

    const stability: RiskLevel =
      this.state.snapshot.overallStatus === 'failed' ? 'high' : this.state.snapshot.overallStatus === 'running' ? 'medium' : 'low';

    return [
      {
        name: 'Platform trust signal',
        level: confLevel,
        message:
          typeof confidence !== 'number'
            ? 'Platform trust not available. Refresh to fetch live trust, or run a pipeline to capture trust at decision time.'
            : confidence >= 0.75
              ? 'High platform trust. The system reports healthy readiness.'
              : confidence >= 0.5
                ? 'Moderate platform trust. Consider monitoring health.'
                : 'Low platform trust. Review service health and dependencies.',
      },
      {
        name: 'Execution stability',
        level: stability,
        message:
          stability === 'high'
            ? 'A step reported an issue. Treat outputs as provisional.'
            : stability === 'medium'
              ? 'Execution is in progress. Some signals may still change.'
              : 'All steps completed without reported issues.',
      },
      {
        name: 'Risk posture',
        level: confLevel === 'high' || stability === 'high' ? 'high' : confLevel === 'medium' ? 'medium' : 'low',
        message: 'A single view combining confidence and execution stability for demo decisions.',
      },
    ];
  }
}

