/**
 * Determinism Engine — validates that same input produces same output (reproducibility).
 * Does not modify engine logic; records and compares.
 */

import type { ReplayRecord, ValidationResult } from '../types';

export class DeterminismEngine {
  private readonly runs: ReplayRecord[] = [];
  private maxRuns = 1000;

  setMaxRuns(n: number): this {
    this.maxRuns = Math.max(1, n);
    return this;
  }

  record(record: ReplayRecord): this {
    this.runs.push(record);
    if (this.runs.length > this.maxRuns) this.runs.shift();
    return this;
  }

  clear(): this {
    this.runs.length = 0;
    return this;
  }

  private inputHash(input: unknown): string {
    try {
      return JSON.stringify(input, Object.keys((input as object) ?? {}).sort());
    } catch {
      return String(input);
    }
  }

  private outputEqual(a: unknown, b: unknown): boolean {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }

  validateForInput(input: unknown): ValidationResult {
    const hash = this.inputHash(input);
    const sameInputRuns = this.runs.filter(
      (r) => this.inputHash(r.input) === hash
    );
    if (sameInputRuns.length <= 1) {
      return {
        valid: true,
        errors: [],
        metadata: { inputHash: hash, runs: sameInputRuns.length },
      };
    }
    const firstOutput = sameInputRuns[0]!.output;
    const errors: string[] = [];
    for (let i = 1; i < sameInputRuns.length; i++) {
      if (!this.outputEqual(firstOutput, sameInputRuns[i]!.output)) {
        errors.push(
          `Determinism violated: run ${i} output differs from run 0 for same input`
        );
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      metadata: { inputHash: hash, runs: sameInputRuns.length },
    };
  }

  validateAll(): ValidationResult {
    const byInput = new Map<string, ReplayRecord[]>();
    for (const r of this.runs) {
      const hash = this.inputHash(r.input);
      if (!byInput.has(hash)) byInput.set(hash, []);
      byInput.get(hash)!.push(r);
    }
    const errors: string[] = [];
    for (const [, runs] of byInput) {
      if (runs.length <= 1) continue;
      const first = runs[0]!.output;
      for (let i = 1; i < runs.length; i++) {
        if (!this.outputEqual(first, runs[i]!.output)) {
          errors.push(
            `Determinism violated: same input produced different output (runs 0 vs ${i})`
          );
          break;
        }
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      metadata: { uniqueInputs: byInput.size, totalRuns: this.runs.length },
    };
  }
}
