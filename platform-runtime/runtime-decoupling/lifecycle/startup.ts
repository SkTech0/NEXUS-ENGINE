/**
 * Per-engine startup lifecycle.
 * Independent startup; no shared process state.
 */

export type StartupHook = () => Promise<void>;

const hooks: StartupHook[] = [];

export function registerStartupHook(hook: StartupHook): void {
  hooks.push(hook);
}

export async function runStartup(): Promise<void> {
  for (const hook of hooks) {
    await hook();
  }
}

export function clearStartupHooks(): void {
  hooks.length = 0;
}
