import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DemoRunSummary {
  id: string;
  createdAt: number;
  title: string;
  status: 'running' | 'completed' | 'failed';
  confidence?: number | null;
}

export interface DemoRunRecord {
  summary: DemoRunSummary;
  input: unknown;
  output: {
    execute?: unknown;
    infer?: unknown;
    optimize?: unknown;
    evaluate?: unknown;
    trust?: unknown;
  };
}

export interface DemoRunRecordPatch {
  summary?: Partial<DemoRunSummary>;
  input?: unknown;
  output?: Partial<DemoRunRecord['output']>;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly runsSubject = new BehaviorSubject<DemoRunRecord[]>([]);
  readonly runs$ = this.runsSubject.asObservable();

  get snapshot(): DemoRunRecord[] {
    return this.runsSubject.value;
  }

  addRun(run: DemoRunRecord): void {
    this.runsSubject.next([run, ...this.runsSubject.value]);
  }

  updateRun(id: string, patch: DemoRunRecordPatch): void {
    const hasInput = Object.prototype.hasOwnProperty.call(patch, 'input');
    const next = this.runsSubject.value.map((r) => {
      if (r.summary.id !== id) return r;
      return {
        ...r,
        ...(hasInput ? { input: patch.input } : {}),
        summary: { ...r.summary, ...(patch.summary ?? {}) },
        output: { ...r.output, ...(patch.output ?? {}) },
      };
    });
    this.runsSubject.next(next);
  }

  clear(): void {
    this.runsSubject.next([]);
  }
}

