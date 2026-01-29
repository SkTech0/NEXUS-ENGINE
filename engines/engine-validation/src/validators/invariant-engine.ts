/**
 * Invariant Engine — validates that engine state and outputs satisfy declared invariants.
 * Does not modify engine logic; observes and asserts.
 */

import type { InvariantCheck, ValidationResult } from '../types';

export class InvariantEngine<T = unknown> {
  private readonly invariants: InvariantCheck<T>[] = [];

  add(invariant: InvariantCheck<T>): this {
    this.invariants.push(invariant);
    return this;
  }

  remove(name: string): this {
    const idx = this.invariants.findIndex((i) => i.name === name);
    if (idx >= 0) this.invariants.splice(idx, 1);
    return this;
  }

  validate(state: T): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const inv of this.invariants) {
      try {
        if (!inv.check(state)) {
          errors.push(inv.message ?? `Invariant "${inv.name}" violated`);
        }
      } catch (e) {
        errors.push(`Invariant "${inv.name}" threw: ${String(e)}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata: { checked: this.invariants.length },
    };
  }

  getInvariantNames(): string[] {
    return this.invariants.map((i) => i.name);
  }
}
