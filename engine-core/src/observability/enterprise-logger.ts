/**
 * Engine Core — Enterprise logger contract (ERL-4).
 * Interface for structured logging; implementation in engines.
 */

import type { LogEntry } from './log-schema';

export interface IEnterpriseLogger {
  readonly engineName: string;
  readonly engineVersion: string;

  info(operation: string, entry: Partial<LogEntry>): void;
  warn(operation: string, entry: Partial<LogEntry>): void;
  error(operation: string, entry: Partial<LogEntry>): void;
  debug(operation: string, entry: Partial<LogEntry>): void;

  withTrace(traceId: string, correlationId?: string): IEnterpriseLogger;
}
