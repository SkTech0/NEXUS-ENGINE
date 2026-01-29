import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoanApplication } from '../models/loan-application.model';

export interface LoanDecisionRecord {
  id: string;
  createdAt: number;
  applicantName: string;
  loanAmount: number;
  outcome: 'APPROVED' | 'REVIEW' | 'REJECTED';
  status: 'running' | 'completed' | 'failed';
  confidence: number | null;
  riskScore: number | null;
  application: LoanApplication;
  output: {
    execute?: unknown;
    infer?: unknown;
    optimize?: unknown;
    evaluate?: unknown;
    trust?: unknown;
  };
}

@Injectable({ providedIn: 'root' })
export class LoanHistoryService {
  private readonly recordsSubject = new BehaviorSubject<LoanDecisionRecord[]>([]);
  readonly records$ = this.recordsSubject.asObservable();

  get snapshot(): LoanDecisionRecord[] {
    return this.recordsSubject.value;
  }

  addRecord(record: LoanDecisionRecord): void {
    this.recordsSubject.next([record, ...this.recordsSubject.value]);
  }

  updateRecord(
    id: string,
    patch: Partial<Pick<LoanDecisionRecord, 'outcome' | 'status' | 'confidence' | 'riskScore'>> & {
      output?: Partial<LoanDecisionRecord['output']>;
    }
  ): void {
    const next = this.recordsSubject.value.map((r) => {
      if (r.id !== id) return r;
      const { output: outputPatch, ...rest } = patch as {
        output?: Partial<LoanDecisionRecord['output']>;
        outcome?: LoanDecisionRecord['outcome'];
        status?: LoanDecisionRecord['status'];
        confidence?: number | null;
        riskScore?: number | null;
      };
      const merged =
        outputPatch != null
          ? { ...r, ...rest, output: { ...r.output, ...outputPatch } }
          : { ...r, ...rest };
      return merged;
    });
    this.recordsSubject.next(next);
  }

  getRecord(id: string): LoanDecisionRecord | undefined {
    return this.recordsSubject.value.find((r) => r.id === id);
  }

  clear(): void {
    this.recordsSubject.next([]);
  }
}
