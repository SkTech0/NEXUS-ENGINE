/**
 * State Validator — validates state transitions and lifecycle.
 * Does not modify engine state machine; observes and asserts.
 */

import type { StateTransition, ValidationResult } from '../types';

export interface StateRule {
  readonly from: string;
  readonly allowed: readonly string[];
  readonly event?: string;
}

export class StateValidator {
  private readonly allowedTransitions: StateRule[] = [];
  private initialState: string | undefined;

  setInitialState(state: string): this {
    this.initialState = state;
    return this;
  }

  addRule(rule: StateRule): this {
    this.allowedTransitions.push(rule);
    return this;
  }

  allow(from: string, to: string | string[], event?: string): this {
    const allowed = Array.isArray(to) ? to : [to];
    this.allowedTransitions.push({ from, allowed, event });
    return this;
  }

  validateTransition(transition: StateTransition): ValidationResult {
    const rule = this.allowedTransitions.find(
      (r) =>
        r.from === transition.from &&
        (r.event === undefined || r.event === transition.event)
    );
    if (!rule) {
      return {
        valid: false,
        errors: [
          `No rule for transition from "${transition.from}" (event: ${transition.event ?? 'any'})`,
        ],
      };
    }
    const allowed = rule.allowed.includes(transition.to);
    return {
      valid: allowed,
      errors: allowed
        ? []
        : [
            `Invalid transition: ${transition.from} → ${transition.to} (allowed: ${rule.allowed.join(', ')})`,
          ],
      metadata: { from: transition.from, to: transition.to },
    };
  }

  validatePath(transitions: StateTransition[]): ValidationResult {
    const errors: string[] = [];
    let current = this.initialState;
    for (const t of transitions) {
      if (current !== undefined && t.from !== current) {
        errors.push(
          `Path broken: expected from "${current}", got from "${t.from}"`
        );
      }
      const result = this.validateTransition(t);
      if (!result.valid && result.errors.length > 0) {
        errors.push(...result.errors);
      }
      current = t.to;
    }
    return {
      valid: errors.length === 0,
      errors,
      metadata: { steps: transitions.length },
    };
  }
}
