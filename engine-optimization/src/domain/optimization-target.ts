export interface OptimizationTarget {
  readonly id: string;
  readonly objective: 'minimize' | 'maximize';
  readonly metric: string;
  readonly constraints?: Record<string, number>;
}
