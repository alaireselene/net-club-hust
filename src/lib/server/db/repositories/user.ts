import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { DbClient } from '../index';
import * as schema from '../schema';
import { BaseRepository } from './base';
import { DatabaseError, UniqueConstraintError } from '../errors';

export type CreateUserInput = Omit<
  schema.User,
  'id' | 'createdAt' | 'role' | 'clubId'
>;

export type UpdateUserInput = Partial<
  Omit<schema.User, 'id' | 'createdAt' | 'email' | 'username'>
>;

export class UserRepository extends BaseRepository<schema.User> {
  constructor(db: DbClient) {
    super(db, schema.user, 'User');
  }

  async findByEmail(email: string): Promise<schema.User | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, email));
      return result[0] || null;
    } catch (error) {
      throw new DatabaseError('Error fetching user by email', error);
    }
  }

  async findByUsername(username: string): Promise<schema.User | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.username, username));
      return result[0] || null;
    } catch (error) {
      throw new DatabaseError('Error fetching user by username', error);
    }
  }

  async createUser(input: CreateUserInput): Promise<schema.User> {
    try {
      // Check unique constraints
      const existingEmail = await this.findByEmail(input.email);
      if (existingEmail) {
        throw new UniqueConstraintError('User', 'email');
      }

      const existingUsername = await this.findByUsername(input.username);
      if (existingUsername) {
        throw new UniqueConstraintError('User', 'username');
      }

      const user: schema.User = {
        ...input,
        id: nanoid(),
        role: 'member',
        clubId: null,
        createdAt: new Date()
      };

      return await this.create(user);
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      throw new DatabaseError('Error creating user', error);
    }
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<schema.User> {
    return await this.update(id, input);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.delete(id);
  }

  async setRole(id: string, role: schema.User['role']): Promise<schema.User> {
    return await this.update(id, { role });
  }

  async setClub(id: string, clubId: string | null): Promise<schema.User> {
    return await this.update(id, { clubId });
  }

  async listByClub(clubId: string): Promise<schema.User[]> {
    try {
      return await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.clubId, clubId));
    } catch (error) {
      throw new DatabaseError('Error fetching users by club', error);
    }
  }

  async listByRole(role: schema.User['role']): Promise<schema.User[]> {
    try {
      return await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.role, role));
    } catch (error) {
      throw new DatabaseError('Error fetching users by role', error);
    }
  }

  async findById(id: string): Promise<schema.User> {
    return super.findById(id);
  }
}