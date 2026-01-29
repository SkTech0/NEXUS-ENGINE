export interface Principal {
  readonly id: string;
  readonly roles: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
}
