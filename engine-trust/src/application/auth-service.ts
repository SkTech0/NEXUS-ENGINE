import type { Principal } from '../domain/principal';

export interface AuthResult {
  readonly principal: Principal | null;
  readonly valid: boolean;
}

export class AuthService {
  async verify(token: string): Promise<AuthResult> {
    return {
      principal: null,
      valid: false,
    };
  }
}
