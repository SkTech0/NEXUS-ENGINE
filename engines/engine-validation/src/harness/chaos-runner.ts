/**
 * Chaos Runner — injects failures, delays, and reorder for distributed correctness tests.
 * Does not modify engine logic; wraps execution with chaos actions.
 */

import type { ChaosAction } from '../types';

export interface ChaosConfig {
  readonly actions: readonly ChaosAction[];
  readonly seed?: number;
}

function simpleHash(seed: number, s: string): number {
  let h = seed;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export class ChaosRunner {
  private readonly config: ChaosConfig;
  private readonly rng: () => number;

  private rngState: number;

  constructor(config: ChaosConfig) {
    this.config = config;
    this.rngState = config.seed ?? Date.now();
    this.rng = () => {
      this.rngState = (this.rngState * 1103515245 + 12345) >>> 0;
      return this.rngState / 0x100000000;
    };
  }

  async applyBeforeExecute(target: string, input: unknown): Promise<void> {
    for (const action of this.config.actions) {
      if (action.target !== undefined && action.target !== target) continue;
      const roll = this.rng();
      if (roll >= action.probability) continue;
      switch (action.type) {
        case 'delay': {
          const ms = (action.params?.ms as number) ?? 100;
          await new Promise((r) => setTimeout(r, ms));
          break;
        }
        case 'fail':
          throw new Error(`Chaos: injected failure for ${target}`);
        case 'drop':
          return;
        default:
          break;
      }
    }
  }

  shouldDrop(target: string): boolean {
    for (const action of this.config.actions) {
      if (action.type !== 'drop') continue;
      if (action.target !== undefined && action.target !== target) continue;
      if (this.rng() < action.probability) return true;
    }
    return false;
  }

  shouldFail(target: string): boolean {
    for (const action of this.config.actions) {
      if (action.type !== 'fail') continue;
      if (action.target !== undefined && action.target !== target) continue;
      if (this.rng() < action.probability) return true;
    }
    return false;
  }
}
