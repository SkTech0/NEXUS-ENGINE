import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EngineService,
  EngineExecuteResponse,
  AiInferResponse,
  OptimizationResponse,
  IntelligenceEvaluateResponse,
  TrustHealthResponse,
} from '../../services/engine.service';
import { LoanApplication } from '../models/loan-application.model';

/** Response from POST /api/loan/evaluate (domain API). */
export interface LoanDomainEvaluateResponse {
  outcome: 'APPROVED' | 'REVIEW' | 'REJECTED';
  riskScore: number;
  confidenceScore: number;
  reasons: string[];
  conditions: string[];
  suggestedActions: string[];
  pipeline?: {
    execute?: unknown;
    infer?: unknown;
    optimize?: unknown;
    evaluate?: unknown;
    trust?: unknown;
  };
}

/**
 * Loan Engine service: calls domain API POST /api/loan/evaluate (preferred) or wraps platform engines for demo.
 * Domain API orchestrates Engine, AI, Optimization, Intelligence, Trust and applies loan business rules.
 */
@Injectable({ providedIn: 'root' })
export class LoanEngineService {
  private readonly baseUrl = '/api';

  constructor(
    private readonly engine: EngineService,
    private readonly http: HttpClient
  ) {}

  /** Evaluate via domain API (single call; platform engines invoked by backend). */
  evaluateViaDomain(application: LoanApplication): Observable<LoanDomainEvaluateResponse> {
    const body = this.applicationToRecord(application);
    return this.http.post<LoanDomainEvaluateResponse>(`${this.baseUrl}/loan/evaluate`, body);
  }

  execute(application: LoanApplication): Observable<EngineExecuteResponse> {
    const payload = {
      action: 'loan_decision',
      parameters: this.applicationToRecord(application),
    };
    return this.engine.execute(payload);
  }

  infer(application: LoanApplication): Observable<AiInferResponse> {
    const payload = {
      modelId: 'default',
      inputs: this.applicationToRecord(application),
    };
    return this.engine.infer(payload);
  }

  evaluate(context: {
    application: LoanApplication;
    execute?: unknown;
    infer?: unknown;
    optimize?: unknown;
  }): Observable<IntelligenceEvaluateResponse> {
    const payload = {
      context: 'loan_approval',
      inputs: {
        application: this.applicationToRecord(context.application),
        engine: context.execute ?? null,
        ai: context.infer ?? null,
        optimization: context.optimize ?? null,
      },
    };
    return this.engine.evaluate(payload);
  }

  optimize(application: LoanApplication): Observable<OptimizationResponse> {
    const payload = {
      targetId: 'loan_approval',
      objective: 'Maximize approval likelihood while minimizing risk',
      constraints: {
        creditScore: application.creditScore,
        incomeToLoan: application.income > 0 ? application.loanAmount / application.income : 0,
        existingLoans: application.existingLoans,
      },
    };
    return this.engine.optimize(payload);
  }

  trustHealth(): Observable<TrustHealthResponse> {
    return this.engine.trustHealth();
  }

  private applicationToRecord(app: LoanApplication): Record<string, unknown> {
    return {
      fullName: app.fullName,
      age: app.age,
      income: app.income,
      employmentType: app.employmentType,
      company: app.company,
      creditScore: app.creditScore,
      loanAmount: app.loanAmount,
      loanTenure: app.loanTenure,
      existingLoans: app.existingLoans,
      city: app.city,
      country: app.country,
      riskFlags: app.riskFlags ?? [],
    };
  }
}
