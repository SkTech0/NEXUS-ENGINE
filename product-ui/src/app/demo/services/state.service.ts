import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, concat, defer, map, of, shareReplay, tap } from 'rxjs';
import { EngineService } from './engine.service';
import { DemoRunRecord, HistoryService } from './history.service';

export type StepId = 'execute' | 'infer' | 'optimize' | 'evaluate' | 'trust';

export interface DemoStep {
  id: StepId;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  startedAt?: number;
  endedAt?: number;
  errorMessage?: string;
}

export interface DemoRunState {
  runId: string | null;
  input: unknown | null;
  createdAt: number | null;
  overallStatus: 'idle' | 'running' | 'completed' | 'failed';
  steps: DemoStep[];
  results: {
    execute?: unknown;
    infer?: unknown;
    optimize?: unknown;
    evaluate?: unknown;
    trust?: unknown;
  };
}

type ScenarioInput = {
  scenario?: string;
  goal?: string;
  constraints?: string[];
  notes?: string;
  createdAt?: string;
  [k: string]: unknown;
};

function createSteps(): DemoStep[] {
  return [
    {
      id: 'execute',
      label: 'Decision Flow',
      description: 'Run the decision engine against your input.',
      status: 'pending',
    },
    {
      id: 'infer',
      label: 'AI Inference',
      description: 'Generate insights and confidence signals.',
      status: 'pending',
    },
    {
      id: 'optimize',
      label: 'Optimization',
      description: 'Improve outcomes given constraints and objectives.',
      status: 'pending',
    },
    {
      id: 'evaluate',
      label: 'Intelligence Evaluation',
      description: 'Score quality, confidence, and readiness.',
      status: 'pending',
    },
    {
      id: 'trust',
      label: 'Trust Health',
      description: 'Check system health and risk indicators.',
      status: 'pending',
    },
  ];
}

function uid(): string {
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly stateSubject = new BehaviorSubject<DemoRunState>({
    runId: null,
    input: null,
    createdAt: null,
    overallStatus: 'idle',
    steps: createSteps(),
    results: {},
  });

  readonly state$ = this.stateSubject.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private activeRunSub: Subscription | null = null;

  constructor(
    private readonly engine: EngineService,
    private readonly history: HistoryService
  ) {}

  get snapshot(): DemoRunState {
    return this.stateSubject.value;
  }

  reset(): void {
    this.activeRunSub?.unsubscribe();
    this.activeRunSub = null;
    this.stateSubject.next({
      runId: null,
      input: null,
      createdAt: null,
      overallStatus: 'idle',
      steps: createSteps(),
      results: {},
    });
  }

  startRun(input: unknown, title?: string): string {
    const runId = uid();
    const createdAt = Date.now();

    this.activeRunSub?.unsubscribe();
    this.activeRunSub = null;

    this.stateSubject.next({
      runId,
      input,
      createdAt,
      overallStatus: 'running',
      steps: createSteps(),
      results: {},
    });

    this.history.addRun({
      summary: {
        id: runId,
        createdAt,
        title: title?.trim() ? title.trim() : 'Decision Flow Run',
        status: 'running',
        confidence: null,
      },
      input,
      output: {},
    });

    this.activeRunSub = this.runPipeline(runId, input).subscribe();
    return runId;
  }

  loadRun(record: DemoRunRecord): void {
    this.activeRunSub?.unsubscribe();
    this.activeRunSub = null;

    const overallStatus: DemoRunState['overallStatus'] =
      record.summary.status === 'completed' ? 'completed' : record.summary.status === 'failed' ? 'failed' : 'idle';

    const steps = createSteps().map((s) => {
      const status: DemoStep['status'] =
        overallStatus === 'completed' ? 'success' : overallStatus === 'failed' ? 'error' : 'pending';
      return { ...s, status };
    });

    this.stateSubject.next({
      runId: record.summary.id,
      input: record.input,
      createdAt: record.summary.createdAt,
      overallStatus,
      steps,
      results: {
        execute: record.output.execute,
        infer: record.output.infer,
        optimize: record.output.optimize,
        evaluate: record.output.evaluate,
        trust: record.output.trust,
      },
    });
  }

  private runPipeline(runId: string, input: unknown): Observable<void> {
    const runStep = <T>(
      stepId: StepId,
      fn: () => Observable<T>,
      onResult: (result: T) => void
    ): Observable<void> => {
      const start = () => this.patchStep(stepId, { status: 'running', startedAt: Date.now(), endedAt: undefined, errorMessage: undefined });
      const success = () => this.patchStep(stepId, { status: 'success', endedAt: Date.now() });
      const fail = (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        this.patchStep(stepId, { status: 'error', endedAt: Date.now(), errorMessage: message });
        this.patchState({ overallStatus: 'failed' });
        this.history.updateRun(runId, { summary: { status: 'failed' } });
      };

      return defer(() => {
        if (this.snapshot.runId !== runId) return of(void 0);
        start();
        return fn().pipe(
          tap((res) => {
            onResult(res);
            success();
          }),
          map(() => void 0),
          catchError((err) => {
            fail(err);
            return of(void 0);
          })
        );
      });
    };

    const scenarioInput: ScenarioInput =
      input && typeof input === 'object' && !Array.isArray(input) ? (input as ScenarioInput) : { value: input };

    const engineExecutePayload = {
      action: 'decision_flow',
      parameters: scenarioInput as Record<string, unknown>,
    };

    const aiInferPayload = {
      modelId: 'default',
      inputs: scenarioInput as Record<string, unknown>,
    };

    const optConstraints = this.parseConstraints(scenarioInput.constraints);
    const optimizationPayload = {
      targetId: scenarioInput.scenario ?? 'default',
      objective: scenarioInput.goal ?? 'Demo objective',
      constraints: optConstraints,
    };

    return concat(
      runStep('execute', () => this.engine.execute(engineExecutePayload), (execute) => {
        this.patchResults({ execute });
        this.history.updateRun(runId, { output: { execute } });
      }),
      runStep('infer', () => this.engine.infer(aiInferPayload), (infer) => {
        this.patchResults({ infer });
        this.history.updateRun(runId, { output: { infer } });
      }),
      runStep('optimize', () => this.engine.optimize(optimizationPayload), (optimize) => {
        this.patchResults({ optimize });
        this.history.updateRun(runId, { output: { optimize } });
      }),
      runStep('evaluate', () => {
        const s = this.snapshot;
        const evaluatePayload = {
          context: scenarioInput.goal ?? scenarioInput.scenario ?? 'demo',
          inputs: {
            scenario: scenarioInput,
            engine: s.results.execute ?? null,
            ai: s.results.infer ?? null,
            optimization: s.results.optimize ?? null,
          },
        };
        return this.engine.evaluate(evaluatePayload);
      }, (evaluate) => {
        this.patchResults({ evaluate });
        const confidence = typeof (evaluate as any)?.confidence === 'number' ? (evaluate as any).confidence : null;
        this.history.updateRun(runId, { output: { evaluate }, summary: { confidence } });
      }),
      runStep('trust', () => this.engine.trustHealth(), (trust) => {
        this.patchResults({ trust });
        this.history.updateRun(runId, { output: { trust } });
      })
    ).pipe(
      tap(() => {
        const s = this.snapshot;
        const anyError = s.steps.some((st) => st.status === 'error');
        if (s.runId !== runId) return;
        if (!anyError) {
          this.patchState({ overallStatus: 'completed' });
          this.history.updateRun(runId, { summary: { status: 'completed' } });
        }
      }),
      map(() => void 0)
    );
  }

  private parseConstraints(lines: unknown): Record<string, number> | null {
    if (!Array.isArray(lines)) return null;
    const out: Record<string, number> = {};
    for (const raw of lines) {
      if (typeof raw !== 'string') continue;
      const s = raw.trim();
      if (!s) continue;
      const key = (s.split(':')[0] || s).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 32) || 'constraint';
      const numMatch = s.match(/-?\d+(\.\d+)?/);
      if (!numMatch) continue;
      const val = Number(numMatch[0]);
      if (Number.isFinite(val)) out[key] = val;
    }
    return Object.keys(out).length ? out : null;
  }

  private patchState(patch: Partial<DemoRunState>): void {
    const prev = this.stateSubject.value;
    this.stateSubject.next({ ...prev, ...patch });
  }

  private patchResults(patch: Partial<DemoRunState['results']>): void {
    const prev = this.stateSubject.value;
    this.stateSubject.next({ ...prev, results: { ...prev.results, ...patch } });
  }

  private patchStep(stepId: StepId, patch: Partial<DemoStep>): void {
    const prev = this.stateSubject.value;
    const nextSteps = prev.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s));
    this.stateSubject.next({ ...prev, steps: nextSteps });
  }
}

