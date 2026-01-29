/**
 * Loan application data model for NEXUS Loan Engine demo.
 */

export interface LoanApplication {
  fullName: string;
  age: number;
  income: number;
  employmentType: string;
  company: string;
  creditScore: number;
  loanAmount: number;
  loanTenure: number;
  existingLoans: number;
  city: string;
  country: string;
  riskFlags?: string[];
}

export type LoanDecisionOutcome = 'APPROVED' | 'REVIEW' | 'REJECTED';

export interface LoanDecisionResult {
  outcome: LoanDecisionOutcome;
  riskScore: number;
  confidenceScore: number;
  reasons: string[];
  conditions: string[];
  suggestedActions: string[];
}
