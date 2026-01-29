/**
 * Engine-core service shell lifecycle.
 * Independent startup/shutdown for this process boundary.
 */

export type LifecycleHook = () => Promise<void>;

const startupHooks: LifecycleHook[] = [];
const shutdownHooks: LifecycleHook[] = [];
let shuttingDown = false;

export function registerStartupHook(hook: LifecycleHook): void {
  startupHooks.push(hook);
}

export function registerShutdownHook(hook: LifecycleHook): void {
  shutdownHooks.push(hook);
}

export async function runStartup(): Promise<void> {
  for (const hook of startupHooks) {
    await hook();
  }
}

export async function runShutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const hook of [...shutdownHooks].reverse()) {
    try {
      await hook();
    } catch (e) {
      console.error('Shutdown hook error:', e);
    }
  }
}

export function isShuttingDown(): boolean {
  return shuttingDown;
}
