/**
 * Consistency Engine — validates that multiple outputs or states are consistent.
 * Same input → same output; cross-run consistency. Does not modify engine logic.
 */

import type { ValidationResult } from '../types';

export interface ConsistencyPair<T> {
  readonly a: T;
  readonly b: T;
  readonly label?: string;
}

export type EqualityFn<T> = (a: T, b: T) => boolean;

export class ConsistencyEngine<T = unknown> {
  private equalityFn: EqualityFn<T> = (a, b) => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  };

  setEquality(fn: EqualityFn<T>): this {
    this.equalityFn = fn;
    return this;
  }

  validatePair(pair: ConsistencyPair<T>): ValidationResult {
    const equal = this.equalityFn(pair.a, pair.b);
    const label = pair.label ?? 'pair';
    return {
      valid: equal,
      errors: equal ? [] : [`Consistency violated for ${label}: outputs differ`],
      metadata: { label },
    };
  }

  validatePairs(pairs: ConsistencyPair<T>[]): ValidationResult {
    const errors: string[] = [];
    for (const pair of pairs) {
      const result = this.validatePair(pair);
      if (!result.valid && result.errors.length > 0) {
        errors.push(...result.errors);
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      metadata: { pairsChecked: pairs.length },
    };
  }

  validateReplayOutputs(inputHash: string, outputs: T[]): ValidationResult {
    if (outputs.length === 0) {
      return { valid: true, errors: [], metadata: { inputHash, count: 0 } };
    }
    const first = outputs[0];
    const errors: string[] = [];
    for (let i = 1; i < outputs.length; i++) {
      if (!this.equalityFn(first, outputs[i]!)) {
        errors.push(`Replay output ${i} differs from first for input ${inputHash}`);
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      metadata: { inputHash, count: outputs.length },
    };
  }
}
