/**
 * Engine port — interface for engine execution.
 * Clean architecture: interface (engine-core); implementation in engines.
 */
export interface EnginePort {
  execute(input: unknown): Promise<unknown>;
  readonly name: string;
}
