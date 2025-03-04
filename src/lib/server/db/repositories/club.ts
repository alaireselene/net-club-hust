import { and, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { DbClient } from '../index';
import * as schema from '../schema';
import { BaseRepository } from './base';
import { DatabaseError, NotFoundError, UniqueConstraintError } from '../errors';

export type CreateClubInput = Omit<
  schema.Club,
  'id' | 'createdAt'
>;

export type UpdateClubInput = Partial<
  Omit<schema.Club, 'id' | 'createdAt' | 'slug'>
>;

export type ClubWithMembers = schema.Club & {
  leader: schema.User | null;
  advisor: schema.User | null;
  memberCount: number;
};

export class ClubRepository extends BaseRepository<schema.Club> {
  constructor(db: DbClient) {
    super(db, schema.club, 'Club');
  }

  private async getClubWithMembers(club: schema.Club): Promise<ClubWithMembers> {
    try {
      // Get club leader
      const [leader] = await this.db
        .select()
        .from(schema.user)
        .where(
          and(
            eq(schema.user.clubId, club.id),
            eq(schema.user.role, 'club_leader')
          )
        );

      // Get club advisor
      const [advisor] = await this.db
        .select()
        .from(schema.user)
        .where(
          and(
            eq(schema.user.clubId, club.id),
            eq(schema.user.role, 'advisor')
          )
        );

      // Get member count
      const [result] = await this.db
        .select({
          count: sql<number>`count(*)`
        })
        .from(schema.user)
        .where(eq(schema.user.clubId, club.id));

      return {
        ...club,
        leader: leader || null,
        advisor: advisor || null,
        memberCount: result.count
      };
    } catch (error) {
      throw new DatabaseError('Error fetching club details', error);
    }
  }

  async findBySlug(slug: string): Promise<ClubWithMembers> {
    try {
      const [club] = await this.db
        .select()
        .from(schema.club)
        .where(eq(schema.club.slug, slug));

      if (!club) {
        throw new NotFoundError('Club', slug);
      }

      return await this.getClubWithMembers(club);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error fetching club by slug', error);
    }
  }

  async createClub(input: CreateClubInput): Promise<ClubWithMembers> {
    try {
      // Check unique constraints
      const existingSlug = await this.db
        .select()
        .from(schema.club)
        .where(eq(schema.club.slug, input.slug));

      if (existingSlug.length) {
        throw new UniqueConstraintError('Club', 'slug');
      }

      const club: schema.Club = {
        ...input,
        id: nanoid(),
        createdAt: new Date()
      };

      await this.create(club);
      return await this.getClubWithMembers(club);
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      throw new DatabaseError('Error creating club', error);
    }
  }

  async updateClub(id: string, input: UpdateClubInput): Promise<ClubWithMembers> {
    try {
      const club = await this.update(id, input);
      return await this.getClubWithMembers(club);
    } catch (error) {
      throw new DatabaseError('Error updating club', error);
    }
  }

  async listMembers(clubId: string): Promise<schema.User[]> {
    try {
      return await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.clubId, clubId));
    } catch (error) {
      throw new DatabaseError('Error listing club members', error);
    }
  }

  async listMembersByRole(clubId: string, role: schema.User['role']): Promise<schema.User[]> {
    try {
      return await this.db
        .select()
        .from(schema.user)
        .where(
          and(
            eq(schema.user.clubId, clubId),
            eq(schema.user.role, role)
          )
        );
    } catch (error) {
      throw new DatabaseError('Error listing club members by role', error);
    }
  }

  async findById(id: string): Promise<ClubWithMembers> {
    const club = await super.findById(id);
    return await this.getClubWithMembers(club);
  }

  async deleteClub(id: string): Promise<void> {
    try {
      // First remove all member associations
      await this.db
        .update(schema.user)
        .set({ clubId: null })
        .where(eq(schema.user.clubId, id));

      // Then delete the club
      await this.delete(id);
    } catch (error) {
      throw new DatabaseError('Error deleting club', error);
    }
  }

  async addMember(clubId: string, userId: string): Promise<void> {
    try {
      await this.db
        .update(schema.user)
        .set({ clubId })
        .where(eq(schema.user.id, userId));
    } catch (error) {
      throw new DatabaseError('Error adding club member', error);
    }
  }

  async removeMember(clubId: string, userId: string): Promise<void> {
    try {
      await this.db
        .update(schema.user)
        .set({ clubId: null })
        .where(
          and(
            eq(schema.user.id, userId),
            eq(schema.user.clubId, clubId)
          )
        );
    } catch (error) {
      throw new DatabaseError('Error removing club member', error);
    }
  }

  async setMemberRole(clubId: string, userId: string, role: schema.User['role']): Promise<void> {
    try {
      await this.db
        .update(schema.user)
        .set({ role })
        .where(
          and(
            eq(schema.user.id, userId),
            eq(schema.user.clubId, clubId)
          )
        );
    } catch (error) {
      throw new DatabaseError('Error updating member role', error);
    }
  }
}