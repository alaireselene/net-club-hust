import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { DbClient } from '../index';
import * as schema from '../schema';
import { BaseRepository } from './base';
import { DatabaseError, NotFoundError, UniqueConstraintError } from '../errors';

export type CreateResearchInput = Omit<
  schema.Research,
  'id' | 'createdAt' | 'updatedAt' | 'status'
>;

export type UpdateResearchInput = Partial<
  Omit<schema.Research, 'id' | 'createdAt' | 'updatedAt'>
>;

export type ResearchWithCoauthors = schema.Research & {
  coauthors: schema.User[];
  projectLead: schema.User;
  advisor: schema.User;
};

export class ResearchRepository extends BaseRepository<schema.Research> {
  constructor(db: DbClient) {
    super(db, schema.research, 'Research');
  }

  private async getResearchCoauthors(researchId: string): Promise<schema.User[]> {
    try {
      const result = await this.db
        .select({
          user: schema.user
        })
        .from(schema.researchCoauthor)
        .innerJoin(
          schema.user,
          eq(schema.researchCoauthor.userId, schema.user.id)
        )
        .where(eq(schema.researchCoauthor.researchId, researchId));

      return result.map(r => r.user);
    } catch (error) {
      throw new DatabaseError('Error fetching research coauthors', error);
    }
  }

  private async getResearchWithDetails(research: schema.Research): Promise<ResearchWithCoauthors> {
    try {
      const [projectLead] = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, research.projectLeadId));

      const [advisor] = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, research.advisorId));

      if (!projectLead || !advisor) {
        throw new NotFoundError('Research team member', research.id);
      }

      const coauthors = await this.getResearchCoauthors(research.id);

      return {
        ...research,
        projectLead,
        advisor,
        coauthors
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error fetching research details', error);
    }
  }

  async createResearch(input: CreateResearchInput): Promise<ResearchWithCoauthors> {
    try {
      const research: schema.Research = {
        ...input,
        id: nanoid(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.create(research);
      return await this.getResearchWithDetails(research);
    } catch (error) {
      throw new DatabaseError('Error creating research', error);
    }
  }

  async updateResearch(id: string, input: UpdateResearchInput): Promise<ResearchWithCoauthors> {
    try {
      const research = await this.update(id, {
        ...input,
        updatedAt: new Date()
      });
      return await this.getResearchWithDetails(research);
    } catch (error) {
      throw new DatabaseError('Error updating research', error);
    }
  }

  async deleteResearch(id: string): Promise<void> {
    try {
      // First delete all coauthor relationships
      await this.db
        .delete(schema.researchCoauthor)
        .where(eq(schema.researchCoauthor.researchId, id));

      // Then delete the research
      await this.delete(id);
    } catch (error) {
      throw new DatabaseError('Error deleting research', error);
    }
  }

  async addCoauthor(researchId: string, userId: string): Promise<void> {
    try {
      // Check if relationship already exists
      const existing = await this.db
        .select()
        .from(schema.researchCoauthor)
        .where(
          and(
            eq(schema.researchCoauthor.researchId, researchId),
            eq(schema.researchCoauthor.userId, userId)
          )
        );

      if (existing.length) {
        throw new UniqueConstraintError('ResearchCoauthor', 'researchId_userId');
      }

      await this.db.insert(schema.researchCoauthor).values({
        id: nanoid(),
        researchId,
        userId,
        createdAt: new Date()
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      throw new DatabaseError('Error adding research coauthor', error);
    }
  }

  async removeCoauthor(researchId: string, userId: string): Promise<void> {
    try {
      await this.db
        .delete(schema.researchCoauthor)
        .where(
          and(
            eq(schema.researchCoauthor.researchId, researchId),
            eq(schema.researchCoauthor.userId, userId)
          )
        );
    } catch (error) {
      throw new DatabaseError('Error removing research coauthor', error);
    }
  }

  async listByStatus(status: schema.Research['status']): Promise<ResearchWithCoauthors[]> {
    try {
      const researches = await this.db
        .select()
        .from(schema.research)
        .where(eq(schema.research.status, status));

      return Promise.all(
        researches.map(research => this.getResearchWithDetails(research))
      );
    } catch (error) {
      throw new DatabaseError('Error fetching research by status', error);
    }
  }

  async listByProjectLead(userId: string): Promise<ResearchWithCoauthors[]> {
    try {
      const researches = await this.db
        .select()
        .from(schema.research)
        .where(eq(schema.research.projectLeadId, userId));

      return Promise.all(
        researches.map(research => this.getResearchWithDetails(research))
      );
    } catch (error) {
      throw new DatabaseError('Error fetching research by project lead', error);
    }
  }

  async listByAdvisor(userId: string): Promise<ResearchWithCoauthors[]> {
    try {
      const researches = await this.db
        .select()
        .from(schema.research)
        .where(eq(schema.research.advisorId, userId));

      return Promise.all(
        researches.map(research => this.getResearchWithDetails(research))
      );
    } catch (error) {
      throw new DatabaseError('Error fetching research by advisor', error);
    }
  }

  async listByCoauthor(userId: string): Promise<ResearchWithCoauthors[]> {
    try {
      const coauthorships = await this.db
        .select({
          research: schema.research
        })
        .from(schema.researchCoauthor)
        .innerJoin(
          schema.research,
          eq(schema.researchCoauthor.researchId, schema.research.id)
        )
        .where(eq(schema.researchCoauthor.userId, userId));

      return Promise.all(
        coauthorships.map(r => this.getResearchWithDetails(r.research))
      );
    } catch (error) {
      throw new DatabaseError('Error fetching research by coauthor', error);
    }
  }

  async findById(id: string): Promise<ResearchWithCoauthors> {
    const research = await super.findById(id);
    return await this.getResearchWithDetails(research);
  }
}