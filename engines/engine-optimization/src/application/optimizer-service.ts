import type { OptimizationTarget } from '../domain/optimization-target';

export interface OptimizationResult {
  readonly targetId: string;
  readonly value: number;
  readonly feasible: boolean;
}

export class OptimizerService {
  async optimize(target: OptimizationTarget): Promise<OptimizationResult> {
    return {
      targetId: target.id,
      value: 0,
      feasible: true,
    };
  }
}
