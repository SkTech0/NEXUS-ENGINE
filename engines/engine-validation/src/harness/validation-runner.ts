/**
 * Validation Runner — runs validators and harnesses in sequence, aggregates results.
 * Does not modify engine logic; orchestrates validation only.
 */

import type { ValidationResult } from '../types';
import { InvariantEngine } from '../validators/invariant-engine';
import { ConsistencyEngine } from '../validators/consistency-engine';
import { DeterminismEngine } from '../validators/determinism-engine';
import { StateValidator } from '../validators/state-validator';
import { DataValidator } from '../validators/data-validator';

export interface ValidationRunnerConfig {
  readonly failFast?: boolean;
}

export interface ValidationReport {
  readonly valid: boolean;
  readonly results: readonly ValidationResult[];
  readonly errors: readonly string[];
  readonly metadata: Record<string, unknown>;
}

export class ValidationRunner {
  private readonly invariantEngine = new InvariantEngine();
  private readonly consistencyEngine = new ConsistencyEngine();
  private readonly determinismEngine = new DeterminismEngine();
  private readonly stateValidator = new StateValidator();
  private readonly dataValidator = new DataValidator();
  private readonly config: Required<ValidationRunnerConfig>;

  constructor(config: ValidationRunnerConfig = {}) {
    this.config = { failFast: config.failFast ?? false };
  }

  getInvariantEngine(): InvariantEngine {
    return this.invariantEngine;
  }

  getConsistencyEngine(): ConsistencyEngine {
    return this.consistencyEngine;
  }

  getDeterminismEngine(): DeterminismEngine {
    return this.determinismEngine;
  }

  getStateValidator(): StateValidator {
    return this.stateValidator;
  }

  getDataValidator(): DataValidator {
    return this.dataValidator;
  }

  runInvariants(state: unknown): ValidationResult {
    return this.invariantEngine.validate(state);
  }

  runDeterminism(): ValidationResult {
    return this.determinismEngine.validateAll();
  }

  runStateTransitions(transitions: { from: string; to: string; event?: string }[]): ValidationResult {
    return this.stateValidator.validatePath(
      transitions.map((t) => ({ from: t.from, to: t.to, event: t.event }))
    );
  }

  runDataValidation(value: unknown): ValidationResult {
    return this.dataValidator.validate(value);
  }

  runAll(state?: unknown, transitions?: { from: string; to: string; event?: string }[], data?: unknown): ValidationReport {
    const results: ValidationResult[] = [];
    const errors: string[] = [];

    if (state !== undefined) {
      const r = this.runInvariants(state);
      results.push(r);
      if (!r.valid) errors.push(...r.errors);
      if (this.config.failFast && errors.length > 0) {
        return { valid: false, results, errors, metadata: {} };
      }
    }

    const det = this.runDeterminism();
    results.push(det);
    if (!det.valid) errors.push(...det.errors);
    if (this.config.failFast && errors.length > 0) {
      return { valid: false, results, errors, metadata: {} };
    }

    if (transitions !== undefined && transitions.length > 0) {
      const st = this.runStateTransitions(transitions);
      results.push(st);
      if (!st.valid) errors.push(...st.errors);
      if (this.config.failFast && errors.length > 0) {
        return { valid: false, results, errors, metadata: {} };
      }
    }

    if (data !== undefined) {
      const dv = this.dataValidator.validate(data);
      results.push(dv);
      if (!dv.valid) errors.push(...dv.errors);
    }

    return {
      valid: errors.length === 0,
      results,
      errors,
      metadata: { totalChecks: results.length },
    };
  }
}
