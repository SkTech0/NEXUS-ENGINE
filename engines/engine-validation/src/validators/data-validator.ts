/**
 * Data Validator — validates schema, contract, and data invariants.
 * Does not modify data pipeline; observes and asserts.
 */

import type { ValidationResult } from '../types';

export type SchemaCheck = (value: unknown) => boolean;

export interface ContractCheck {
  readonly name: string;
  check(value: unknown): boolean;
}

export class DataValidator {
  private schemaCheck?: SchemaCheck;
  private readonly contractChecks: ContractCheck[] = [];

  setSchemaCheck(check: SchemaCheck): this {
    this.schemaCheck = check;
    return this;
  }

  addContract(check: ContractCheck): this {
    this.contractChecks.push(check);
    return this;
  }

  validate(value: unknown): ValidationResult {
    const errors: string[] = [];

    if (this.schemaCheck) {
      try {
        if (!this.schemaCheck(value)) {
          errors.push('Schema validation failed');
        }
      } catch (e) {
        errors.push(`Schema check threw: ${String(e)}`);
      }
    }

    for (const c of this.contractChecks) {
      try {
        if (!c.check(value)) {
          errors.push(`Contract "${c.name}" failed`);
        }
      } catch (e) {
        errors.push(`Contract "${c.name}" threw: ${String(e)}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      metadata: {
        schemaChecked: this.schemaCheck !== undefined,
        contractsChecked: this.contractChecks.length,
      },
    };
  }

  validatePipeline(input: unknown, output: unknown): ValidationResult {
    const inputResult = this.validate(input);
    const outputResult = this.validate(output);
    const errors = [...inputResult.errors, ...outputResult.errors];
    return {
      valid: errors.length === 0,
      errors,
      metadata: {
        inputValid: inputResult.valid,
        outputValid: outputResult.valid,
      },
    };
  }
}
