import { and, eq, or, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { DbClient } from '../index';
import * as schema from '../schema';
import { BaseRepository } from './base';
import { DatabaseError, NotFoundError } from '../errors';
import type { AuthUser } from '$lib/server/auth';

export type CreateResourceInput = Omit<
  schema.Resource,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateResourceInput = Partial<
  Omit<schema.Resource, 'id' | 'createdAt' | 'updatedAt' | 'uploaderId'>
>;

export type ResourceWithUploader = schema.Resource & {
  uploader: schema.User;
};

export class ResourceRepository extends BaseRepository<schema.Resource> {
  constructor(db: DbClient) {
    super(db, schema.resource, 'Resource');
  }

  private async getResourceWithUploader(resource: schema.Resource): Promise<ResourceWithUploader> {
    try {
      const [uploader] = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, resource.uploaderId));

      if (!uploader) {
        throw new NotFoundError('Resource uploader', resource.uploaderId);
      }

      return {
        ...resource,
        uploader
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error fetching resource details', error);
    }
  }

  private canAccessResource(resource: schema.Resource, user: AuthUser | null): boolean {
    if (resource.accessLevel === 'public') return true;
    if (!user) return false;

    if (user.role === 'admin') return true;
    if (resource.accessLevel === 'leaders' && user.role === 'club_leader') return true;

    // Members can access member-level resources
    if (resource.accessLevel === 'members') {
      // If resource belongs to a club, user must be in that club
      if (resource.clubId) {
        return user.clubId === resource.clubId;
      }
      // If resource doesn't belong to a club, any member can access
      return true;
    }

    return false;
  }

  // Override the protected findById from BaseRepository
  protected async findById(id: string): Promise<schema.Resource> {
    return await super.findById(id);
  }

  // Public method for finding resources with access control
  async findResourceById(id: string, user: AuthUser | null): Promise<ResourceWithUploader> {
    const resource = await this.findById(id);

    if (!this.canAccessResource(resource, user)) {
      throw new DatabaseError('Access denied');
    }

    return await this.getResourceWithUploader(resource);
  }

  async createResource(input: CreateResourceInput): Promise<ResourceWithUploader> {
    try {
      const resource: schema.Resource = {
        ...input,
        id: nanoid(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.create(resource);
      return await this.getResourceWithUploader(resource);
    } catch (error) {
      throw new DatabaseError('Error creating resource', error);
    }
  }

  async updateResource(id: string, input: UpdateResourceInput): Promise<ResourceWithUploader> {
    try {
      const resource = await this.update(id, {
        ...input,
        updatedAt: new Date()
      });
      return await this.getResourceWithUploader(resource);
    } catch (error) {
      throw new DatabaseError('Error updating resource', error);
    }
  }

  async listAccessible(user: AuthUser | null): Promise<ResourceWithUploader[]> {
    try {
      let query = this.db
        .select()
        .from(schema.resource)
        .where(eq(schema.resource.accessLevel, 'public'));

      if (user) {
        if (user.role === 'admin') {
          // Admins can access all resources
          query = this.db.select().from(schema.resource);
        } else if (user.role === 'club_leader') {
          // Club leaders can access public, member, and leader resources
          query = this.db
            .select()
            .from(schema.resource)
            .where(
              or(
                eq(schema.resource.accessLevel, 'public'),
                eq(schema.resource.accessLevel, 'members'),
                eq(schema.resource.accessLevel, 'leaders')
              )
            );
        } else {
          // Regular members can access public resources and member resources for their club
          const conditions = [
            eq(schema.resource.accessLevel, 'public'),
            and(
              eq(schema.resource.accessLevel, 'members'),
              or(
                isNull(schema.resource.clubId),
                user.clubId ? eq(schema.resource.clubId, user.clubId) : isNull(schema.resource.clubId)
              )
            )
          ];

          query = this.db
            .select()
            .from(schema.resource)
            .where(or(...conditions));
        }
      }

      const resources = await query;
      return Promise.all(
        resources.map(resource => this.getResourceWithUploader(resource))
      );
    } catch (error) {
      throw new DatabaseError('Error listing accessible resources', error);
    }
  }

  async listByClub(clubId: string, user: AuthUser | null): Promise<ResourceWithUploader[]> {
    try {
      const resources = await this.db
        .select()
        .from(schema.resource)
        .where(eq(schema.resource.clubId, clubId));

      // Filter based on access level
      const accessibleResources = resources.filter(resource =>
        this.canAccessResource(resource, user)
      );

      return Promise.all(
        accessibleResources.map(resource => this.getResourceWithUploader(resource))
      );
    } catch (error) {
      throw new DatabaseError('Error listing club resources', error);
    }
  }

  async listByCategory(
    category: schema.Resource['category'],
    user: AuthUser | null
  ): Promise<ResourceWithUploader[]> {
    try {
      const resources = await this.db
        .select()
        .from(schema.resource)
        .where(eq(schema.resource.category, category));

      // Filter based on access level
      const accessibleResources = resources.filter(resource =>
        this.canAccessResource(resource, user)
      );

      return Promise.all(
        accessibleResources.map(resource => this.getResourceWithUploader(resource))
      );
    } catch (error) {
      throw new DatabaseError('Error listing category resources', error);
    }
  }

  async listByUploader(uploaderId: string, user: AuthUser | null): Promise<ResourceWithUploader[]> {
    try {
      const resources = await this.db
        .select()
        .from(schema.resource)
        .where(eq(schema.resource.uploaderId, uploaderId));

      // Filter based on access level
      const accessibleResources = resources.filter(resource =>
        this.canAccessResource(resource, user)
      );

      return Promise.all(
        accessibleResources.map(resource => this.getResourceWithUploader(resource))
      );
    } catch (error) {
      throw new DatabaseError('Error listing uploader resources', error);
    }
  }

  async deleteResource(id: string): Promise<void> {
    return await this.delete(id);
  }
}