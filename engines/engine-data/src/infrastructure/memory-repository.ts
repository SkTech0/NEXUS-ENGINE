import type { Repository } from '../domain/repository';

export class MemoryRepository<T extends { id: string }> implements Repository<T> {
  private readonly store = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async save(entity: T): Promise<void> {
    this.store.set(entity.id, entity);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
