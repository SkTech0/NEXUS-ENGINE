/**
 * Per-engine shutdown lifecycle.
 * Independent shutdown; graceful teardown.
 */

export type ShutdownHook = () => Promise<void>;

const hooks: ShutdownHook[] = [];
let shuttingDown = false;

export function registerShutdownHook(hook: ShutdownHook): void {
  hooks.push(hook);
}

export function isShuttingDown(): boolean {
  return shuttingDown;
}

export async function runShutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  const ordered = [...hooks].reverse();
  for (const hook of ordered) {
    try {
      await hook();
    } catch (e) {
      console.error('Shutdown hook error:', e);
    }
  }
}

export function clearShutdownHooks(): void {
  hooks.length = 0;
}
