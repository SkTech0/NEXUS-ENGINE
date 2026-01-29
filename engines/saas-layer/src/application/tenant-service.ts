import type { Tenant } from '../domain/tenant';

export class TenantService {
  async getTenant(id: string): Promise<Tenant | null> {
    return null;
  }
}
