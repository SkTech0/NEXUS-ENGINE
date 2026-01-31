/**
 * Frontend-only UI state and display metadata for enterprise inspection views.
 * No backend dependency; used for consistent sectioning and auditability.
 */

export type DisplayStatus = 'idle' | 'pending' | 'running' | 'completed' | 'failed' | 'partial' | 'degraded';

export interface DisplayMetadata {
  runId: string | null;
  createdAt: number | null;
  stepOrder?: string[];
  correlationId?: string | null;
  version?: string | null;
}

export interface SectionConfig {
  key: string;
  label: string;
  hint?: string;
}
