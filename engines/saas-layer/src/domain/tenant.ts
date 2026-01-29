export interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly plan: string;
  readonly active: boolean;
}
