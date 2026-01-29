import type { DecisionContext, DecisionResult } from '../domain/decision';

export class DecisionService {
  async evaluate(context: DecisionContext): Promise<DecisionResult> {
    return {
      outcome: 'default',
      confidence: 0,
      payload: context.inputs,
    };
  }
}
