import { sql } from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import type { DbClient } from '../index';
import { DatabaseError, NotFoundError } from '../errors';

export abstract class BaseRepository<T extends { id: string }> {
  constructor(
    protected readonly db: DbClient,
    protected readonly table: SQLiteTable,
    protected readonly entityName: string
  ) { }

  protected async findById(id: string): Promise<T> {
    try {
      const result = await this.db
        .select()
        .from(this.table)
        .where(sql`${this.table}.id = ${id}`);

      if (!result.length) {
        throw new NotFoundError(this.entityName, id);
      }

      return result[0] as T;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Error fetching ${this.entityName}`, error);
    }
  }

  protected async create(data: Omit<T, 'id'> & { id: string }): Promise<T> {
    try {
      await this.db.insert(this.table).values(data);
      return data as T;
    } catch (error) {
      throw new DatabaseError(`Error creating ${this.entityName}`, error);
    }
  }

  protected async update(id: string, data: Partial<T>): Promise<T> {
    try {
      await this.db
        .update(this.table)
        .set(data)
        .where(sql`${this.table}.id = ${id}`);
      return this.findById(id);
    } catch (error) {
      throw new DatabaseError(`Error updating ${this.entityName}`, error);
    }
  }

  protected async delete(id: string): Promise<void> {
    try {
      const result = await this.db
        .delete(this.table)
        .where(sql`${this.table}.id = ${id}`);
      if (!result.success) {
        throw new NotFoundError(this.entityName, id);
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Error deleting ${this.entityName}`, error);
    }
  }

  protected async exists(id: string): Promise<boolean> {
    try {
      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(this.table)
        .where(sql`${this.table}.id = ${id}`);
      return result[0].count > 0;
    } catch (error) {
      throw new DatabaseError(`Error checking ${this.entityName} existence`, error);
    }
  }
}