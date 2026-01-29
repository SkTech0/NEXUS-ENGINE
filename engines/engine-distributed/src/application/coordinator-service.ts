import type { Coordinator, CoordinatorConfig } from '../domain/coordinator';

export class CoordinatorService implements Coordinator {
  constructor(public readonly config: CoordinatorConfig) {}

  async start(): Promise<void> {
    // Bootstrap distributed coordinator
  }

  async stop(): Promise<void> {
    // Graceful shutdown
  }
}
