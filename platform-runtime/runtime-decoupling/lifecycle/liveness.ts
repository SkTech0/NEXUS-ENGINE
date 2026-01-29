/**
 * Per-engine liveness probe.
 * Independent liveness; process is alive.
 */

export type LivenessChecker = () => Promise<boolean>;

const checkers: LivenessChecker[] = [];

export function registerLivenessChecker(checker: LivenessChecker): void {
  checkers.push(checker);
}

export async function runLivenessCheck(): Promise<boolean> {
  if (checkers.length === 0) return true;
  const results = await Promise.all(checkers.map((c) => c()));
  return results.every(Boolean);
}

export function clearLivenessCheckers(): void {
  checkers.length = 0;
}
