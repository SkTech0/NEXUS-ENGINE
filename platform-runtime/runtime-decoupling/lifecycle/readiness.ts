/**
 * Per-engine readiness probe.
 * Independent readiness; can serve traffic.
 */

export type ReadinessChecker = () => Promise<boolean>;

const checkers: ReadinessChecker[] = [];

export function registerReadinessChecker(checker: ReadinessChecker): void {
  checkers.push(checker);
}

export async function runReadinessCheck(): Promise<boolean> {
  if (checkers.length === 0) return true;
  const results = await Promise.all(checkers.map((c) => c()));
  return results.every(Boolean);
}

export function clearReadinessCheckers(): void {
  checkers.length = 0;
}
