export type Identifier = string;

export function createIdentifier(): Identifier {
  return crypto.randomUUID();
}
