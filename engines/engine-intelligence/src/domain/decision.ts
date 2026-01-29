export interface DecisionContext {
  readonly inputs: Record<string, unknown>;
  readonly metadata?: Record<string, unknown>;
}

export interface DecisionResult {
  readonly outcome: string;
  readonly confidence: number;
  readonly payload?: unknown;
}
