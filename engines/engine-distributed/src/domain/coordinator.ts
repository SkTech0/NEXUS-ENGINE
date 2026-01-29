export interface CoordinatorConfig {
  readonly nodeId: string;
  readonly clusterSize: number;
}

export interface Coordinator {
  readonly config: CoordinatorConfig;
  start(): Promise<void>;
  stop(): Promise<void>;
}
