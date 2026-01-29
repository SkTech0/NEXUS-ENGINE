import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, concat, defer, map, of, shareReplay, tap } from 'rxjs';
import { LoanEngineService, LoanDomainEvaluateResponse } from './loan-engine.service';
import { LoanHistoryService, LoanDecisionRecord } from './loan-history.service';
import { LoanApplication, LoanDecisionOutcome } from '../models/loan-application.model';
import type { TrustHealthResponse } from '../../services/engine.service';

export type LoanStepId = 'execute' | 'infer' | 'evaluate' | 'optimize' | 'trust';

export interface LoanStep {
  id: LoanStepId;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  startedAt?: number;
  endedAt?: number;
  errorMessage?: string;
}

export interface LoanRunState {
  runId: string | null;
  application: LoanApplication | null;
  createdAt: number | null;
  overallStatus: 'idle' | 'running' | 'completed' | 'failed';
  steps: LoanStep[];
  results: {
    execute?: unknown;
    infer?: unknown;
    optimize?: unknown;
    evaluate?: unknown;
    trust?: unknown;
  };
  /** When run used domain API POST /api/loan/evaluate, store result here. */
  domainOutcome?: LoanDecisionOutcome | null;
  domainRiskScore?: number | null;
  domainConfidence?: number | null;
}

function createLoanSteps(): LoanStep[] {
  return [
    { id: 'execute', label: 'Decision Flow', description: 'Run the loan decision engine.', status: 'pending' },
    { id: 'infer', label: 'AI Inference', description: 'Generate risk and eligibility insights.', status: 'pending' },
    { id: 'optimize', label: 'Optimization', description: 'Balance approval and risk constraints.', status: 'pending' },
    { id: 'evaluate', label: 'Intelligence Evaluation', description: 'Score quality and confidence.', status: 'pending' },
    { id: 'trust', label: 'Trust Health', description: 'Check system health and risk indicators.', status: 'pending' },
  ];
}

function uid(): string {
  return `loan_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable({ providedIn: 'root' })
export class LoanStateService {
  private readonly stateSubject = new BehaviorSubject<LoanRunState>({
    runId: null,
    application: null,
    createdAt: null,
    overallStatus: 'idle',
    steps: createLoanSteps(),
    results: {},
  });

  readonly state$ = this.stateSubject.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private activeRunSub: Subscription | null = null;

  constructor(
    private readonly loanEngine: LoanEngineService,
    private readonly loanHistory: LoanHistoryService
  ) {}

  get snapshot(): LoanRunState {
    return this.stateSubject.value;
  }

  reset(): void {
    this.activeRunSub?.unsubscribe();
    this.activeRunSub = null;
    this.stateSubject.next({
      runId: null,
      application: null,
      createdAt: null,
      overallStatus: 'idle',
      steps: createLoanSteps(),
      results: {},
      domainOutcome: undefined,
      domainRiskScore: undefined,
      domainConfidence: undefined,
    });
  }

  setApplication(application: LoanApplication): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      application,
    });
  }

  startEvaluation(): string | null {
    const app = this.snapshot.application;
    if (!app) return null;

    const runId = uid();
    const createdAt = Date.now();

    this.activeRunSub?.unsubscribe();
    this.activeRunSub = null;

    this.stateSubject.next({
      runId,
      application: app,
      createdAt,
      overallStatus: 'running',
      steps: createLoanSteps(),
      results: {},
    });

    this.loanHistory.addRecord({
      id: runId,
      createdAt,
      applicantName: app.fullName,
      loanAmount: app.loanAmount,
      outcome: 'REVIEW',
      status: 'running',
      confidence: null,
      riskScore: null,
      application: app,
      output: {},
    });

    this.activeRunSub = this.runPipeline(runId, app).subscribe();
    return runId;
  }

  loadRecord(record: LoanDecisionRecord): void {
    this.activeRunSub?.unsubscribe();
    this.activeRunSub = null;

    const overallStatus: LoanRunState['overallStatus'] =
      record.status === 'completed' ? 'completed' : record.status === 'failed' ? 'failed' : 'idle';

    const steps = createLoanSteps().map((s) => {
      const status: LoanStep['status'] =
        overallStatus === 'completed' ? 'success' : overallStatus === 'failed' ? 'error' : 'pending';
      return { ...s, status };
    });

    this.stateSubject.next({
      runId: record.id,
      application: record.application,
      createdAt: record.createdAt,
      overallStatus,
      steps,
      results: {
        execute: record.output.execute,
        infer: record.output.infer,
        optimize: record.output.optimize,
        evaluate: record.output.evaluate,
        trust: record.output.trust,
      },
      domainOutcome: record.outcome ?? undefined,
      domainRiskScore: record.riskScore ?? undefined,
      domainConfidence: record.confidence ?? undefined,
    });
  }

  private runPipeline(runId: string, application: LoanApplication): Observable<void> {
    // Domain API: single POST /api/loan/evaluate (backend orchestrates Engine, AI, Optimization, Intelligence, Trust)
    const stepIds: LoanStepId[] = ['execute', 'infer', 'optimize', 'evaluate', 'trust'];
    return defer(() => {
      if (this.snapshot.runId !== runId) return of(void 0);
      stepIds.forEach((id) =>
        this.patchStep(id, { status: 'running', startedAt: Date.now(), endedAt: undefined, errorMessage: undefined })
      );
      return this.loanEngine.evaluateViaDomain(application).pipe(
        tap((res: LoanDomainEvaluateResponse) => {
          const p = res.pipeline;
          this.patchResults({
            execute: p?.execute,
            infer: p?.infer,
            optimize: p?.optimize,
            evaluate: p?.evaluate,
            trust: p?.trust,
          });
          const outcome = (res.outcome ?? 'REVIEW') as LoanDecisionOutcome;
          this.patchState({
            overallStatus: 'completed',
            domainOutcome: outcome,
            domainRiskScore: res.riskScore,
            domainConfidence: res.confidenceScore,
          });
          stepIds.forEach((id) => this.patchStep(id, { status: 'success', endedAt: Date.now() }));
          this.loanHistory.updateRecord(runId, {
            status: 'completed',
            outcome,
            riskScore: res.riskScore,
            confidence: res.confidenceScore,
            output: {
              execute: p?.execute,
              infer: p?.infer,
              optimize: p?.optimize,
              evaluate: p?.evaluate,
              trust: p?.trust,
            },
          });
        }),
        map(() => void 0),
        catchError((err: unknown) => {
          const message = err instanceof Error ? err.message : 'Something went wrong';
          stepIds.forEach((id) => this.patchStep(id, { status: 'error', endedAt: Date.now(), errorMessage: message }));
          this.patchState({ overallStatus: 'failed' });
          this.loanHistory.updateRecord(runId, { status: 'failed' });
          return of(void 0);
        })
      );
    });
  }

  /**
   * Outcome: prefer domain API result when present; otherwise from pipeline or application.
   */
  deriveOutcome(
    results: LoanRunState['results'],
    application?: LoanApplication | null,
    domainOutcome?: LoanDecisionOutcome | null
  ): LoanDecisionOutcome {
    if (domainOutcome != null) return domainOutcome;
    const evalRes = results.evaluate as { outcome?: string } | undefined;
    const apiOutcome = evalRes?.outcome?.toUpperCase?.();
    if (apiOutcome === 'APPROVED' || apiOutcome === 'APPROVE') return 'APPROVED';
    if (apiOutcome === 'REJECTED' || apiOutcome === 'REJECT') return 'REJECTED';
    if (apiOutcome === 'REVIEW') return 'REVIEW';

    if (application) {
      const risk = this.computeRiskFromApplication(application, results);
      return this.outcomeFromRiskAndApplication(risk, application);
    }
    return 'REVIEW';
  }

  /**
   * Risk score: prefer domain API result when present; otherwise from pipeline or application.
   */
  deriveRiskScore(
    results: LoanRunState['results'],
    application?: LoanApplication | null,
    domainRiskScore?: number | null
  ): number | null {
    if (domainRiskScore != null && Number.isFinite(domainRiskScore)) return domainRiskScore;
    const evalRes = results.evaluate as { confidence?: number; payload?: { riskScore?: number } } | undefined;
    if (typeof evalRes?.payload?.riskScore === 'number') return Math.round(evalRes.payload.riskScore);
    if (typeof evalRes?.confidence === 'number') return Math.round((1 - evalRes.confidence) * 100);
    const inferRes = results.infer as { outputs?: { riskScore?: number } } | undefined;
    if (typeof inferRes?.outputs?.riskScore === 'number') return Math.round(inferRes.outputs.riskScore);

    if (application) return this.computeRiskFromApplication(application, results);
    return null;
  }

  /**
   * Confidence: prefer domain API result when present; otherwise from pipeline.
   */
  deriveConfidence(results: LoanRunState['results'], domainConfidence?: number | null): number | null {
    if (domainConfidence != null && Number.isFinite(domainConfidence)) return domainConfidence;
    const evalRes = results.evaluate as { confidence?: number } | undefined;
    if (typeof evalRes?.confidence === 'number') return evalRes.confidence;
    const inferRes = results.infer as { outputs?: { confidence?: number } } | undefined;
    const trustRes = results.trust as TrustHealthResponse | undefined;
    const optRes = results.optimize as { feasible?: boolean } | undefined;
    const executeRes = results.execute as { status?: string } | undefined;

    const parts: number[] = [];
    if (typeof inferRes?.outputs?.confidence === 'number') parts.push(inferRes.outputs.confidence);
    if (typeof trustRes?.confidence === 'number') parts.push(trustRes.confidence);
    if (optRes?.feasible === true) parts.push(0.85);
    else if (optRes?.feasible === false) parts.push(0.5);
    if (executeRes?.status === 'ok' || executeRes?.status === 'success') parts.push(0.9);
    if (parts.length === 0) return null;
    const raw = parts.reduce((a, b) => a + b, 0) / parts.length;
    return Math.max(0, Math.min(1, raw));
  }

  /**
   * Deterministic risk from application + pipeline outputs (creditScore, income/loan, existingLoans, employment, AI, trust).
   */
  private computeRiskFromApplication(app: LoanApplication, results: LoanRunState['results']): number {
    let risk = 0;
    if (app.creditScore <= 300) risk += 40;
    else if (app.creditScore <= 500) risk += 30;
    else if (app.creditScore <= 600) risk += 20;
    else if (app.creditScore <= 700) risk += 10;
    else if (app.creditScore >= 750) risk -= 5;

    const incomeToLoan = app.income > 0 ? app.loanAmount / app.income : 1;
    if (incomeToLoan > 0.5) risk += 15;
    else if (incomeToLoan > 0.3) risk += 8;

    if (app.existingLoans >= 3) risk += 15;
    else if (app.existingLoans >= 1) risk += 5;

    const empRisk: Record<string, number> = {
      'Full-time': 0,
      'Part-time': 5,
      'Self-employed': 10,
      Contract: 10,
      Freelance: 15,
    };
    risk += empRisk[app.employmentType] ?? 5;

    const flags = Array.isArray(app.riskFlags) ? app.riskFlags.length : 0;
    risk += Math.min(flags * 5, 20);

    const inferRes = results.infer as { outputs?: { riskScore?: number } } | undefined;
    if (typeof inferRes?.outputs?.riskScore === 'number') {
      risk = (risk + inferRes.outputs.riskScore) / 2;
    }
    const trustRes = results.trust as TrustHealthResponse | undefined;
    if (typeof trustRes?.confidence === 'number') {
      const trustRisk = (1 - trustRes.confidence) * 100;
      risk = (risk + trustRisk) / 2;
    }

    return Math.round(Math.max(0, Math.min(100, risk)));
  }

  private outcomeFromRiskAndApplication(riskScore: number, app: LoanApplication): LoanDecisionOutcome {
    const highCredit = app.creditScore >= 750;
    const mediumCredit = app.creditScore >= 600 && app.creditScore < 750;
    const lowCredit = app.creditScore < 600;
    const lowRisk = riskScore <= 35;
    const mediumRisk = riskScore > 35 && riskScore <= 60;
    const highRisk = riskScore > 60;

    if (highCredit && lowRisk && (app.income > 0 && app.loanAmount / app.income <= 0.4)) return 'APPROVED';
    if (highRisk || lowCredit) return 'REJECTED';
    if (mediumCredit || mediumRisk) return 'REVIEW';
    return 'REVIEW';
  }

  private patchState(patch: Partial<LoanRunState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...patch });
  }

  private patchResults(patch: Partial<LoanRunState['results']>): void {
    const prev = this.stateSubject.value;
    this.stateSubject.next({ ...prev, results: { ...prev.results, ...patch } });
  }

  private patchStep(stepId: LoanStepId, patch: Partial<LoanStep>): void {
    const prev = this.stateSubject.value;
    const nextSteps = prev.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s));
    this.stateSubject.next({ ...prev, steps: nextSteps });
  }
}
