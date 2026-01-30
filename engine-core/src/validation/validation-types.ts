/**
 * Engine Core — Validation layer contract (ERL-4).
 * Input/schema/contract/domain validation; boundary checks.
 */

export interface ValidationIssue {
  readonly path?: string;
  readonly message: string;
  readonly code?: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: ValidationIssue[];
}

export interface IValidationLayer {
  validateInput(operation: string, input: unknown): ValidationResult;
  validateContract(operation: string, payload: unknown): ValidationResult;
}
