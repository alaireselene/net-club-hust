import { and, eq, gte, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { DbClient } from '../index';
import * as schema from '../schema';
import { BaseRepository } from './base';
import { DatabaseError, NotFoundError, UniqueConstraintError } from '../errors';
import type { AuthUser } from '$lib/server/auth';

export type CreatePostInput = Omit<
  schema.Post,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'publishedAt'
>;

export type UpdatePostInput = Partial<
  Omit<schema.Post, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'slug'>
>;

export type PostWithAuthor = schema.Post & {
  author: schema.User;
  club: schema.Club | null;
};

export class PostRepository extends BaseRepository<schema.Post> {
  constructor(db: DbClient) {
    super(db, schema.post, 'Post');
  }

  private async getPostWithRelations(post: schema.Post): Promise<PostWithAuthor> {
    try {
      const [author] = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, post.authorId));

      if (!author) {
        throw new NotFoundError('Post author', post.authorId);
      }

      let club: schema.Club | null = null;
      if (post.clubId) {
        const [foundClub] = await this.db
          .select()
          .from(schema.club)
          .where(eq(schema.club.id, post.clubId));
        club = foundClub || null;
      }

      return {
        ...post,
        author,
        club
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error fetching post relations', error);
    }
  }

  async findBySlug(slug: string): Promise<PostWithAuthor> {
    try {
      const [post] = await this.db
        .select()
        .from(schema.post)
        .where(eq(schema.post.slug, slug));

      if (!post) {
        throw new NotFoundError('Post', slug);
      }

      return await this.getPostWithRelations(post);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error fetching post by slug', error);
    }
  }

  async createPost(input: CreatePostInput): Promise<PostWithAuthor> {
    try {
      // Check unique constraints
      const existingSlug = await this.db
        .select()
        .from(schema.post)
        .where(eq(schema.post.slug, input.slug));

      if (existingSlug.length) {
        throw new UniqueConstraintError('Post', 'slug');
      }

      const post: schema.Post = {
        ...input,
        id: nanoid(),
        status: 'draft',
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.create(post);
      return await this.getPostWithRelations(post);
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      throw new DatabaseError('Error creating post', error);
    }
  }

  async updatePost(id: string, input: UpdatePostInput): Promise<PostWithAuthor> {
    try {
      const post = await this.update(id, {
        ...input,
        updatedAt: new Date()
      });
      return await this.getPostWithRelations(post);
    } catch (error) {
      throw new DatabaseError('Error updating post', error);
    }
  }

  async publishPost(id: string): Promise<PostWithAuthor> {
    try {
      const post = await this.update(id, {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date()
      });
      return await this.getPostWithRelations(post);
    } catch (error) {
      throw new DatabaseError('Error publishing post', error);
    }
  }

  async archivePost(id: string): Promise<PostWithAuthor> {
    try {
      const post = await this.update(id, {
        status: 'archived',
        updatedAt: new Date()
      });
      return await this.getPostWithRelations(post);
    } catch (error) {
      throw new DatabaseError('Error archiving post', error);
    }
  }

  async listPublished(options: {
    category?: schema.Post['category'];
    clubId?: string;
  } = {}): Promise<PostWithAuthor[]> {
    try {
      const conditions = [
        eq(schema.post.status, 'published'),
        gte(schema.post.publishedAt, new Date())
      ];

      if (options.category) {
        conditions.push(eq(schema.post.category, options.category));
      }

      if (options.clubId) {
        conditions.push(eq(schema.post.clubId, options.clubId));
      }

      const posts = await this.db
        .select()
        .from(schema.post)
        .where(and(...conditions));

      return Promise.all(posts.map(post => this.getPostWithRelations(post)));
    } catch (error) {
      throw new DatabaseError('Error listing published posts', error);
    }
  }

  async listByAuthor(authorId: string): Promise<PostWithAuthor[]> {
    try {
      const posts = await this.db
        .select()
        .from(schema.post)
        .where(eq(schema.post.authorId, authorId));

      return Promise.all(posts.map(post => this.getPostWithRelations(post)));
    } catch (error) {
      throw new DatabaseError('Error listing posts by author', error);
    }
  }

  async listByClub(clubId: string): Promise<PostWithAuthor[]> {
    try {
      const posts = await this.db
        .select()
        .from(schema.post)
        .where(eq(schema.post.clubId, clubId));

      return Promise.all(posts.map(post => this.getPostWithRelations(post)));
    } catch (error) {
      throw new DatabaseError('Error listing posts by club', error);
    }
  }

  async listDrafts(authorId: string): Promise<PostWithAuthor[]> {
    try {
      const posts = await this.db
        .select()
        .from(schema.post)
        .where(
          and(
            eq(schema.post.status, 'draft'),
            eq(schema.post.authorId, authorId)
          )
        );

      return Promise.all(posts.map(post => this.getPostWithRelations(post)));
    } catch (error) {
      throw new DatabaseError('Error listing draft posts', error);
    }
  }

  async findById(id: string): Promise<PostWithAuthor> {
    const post = await super.findById(id);
    return await this.getPostWithRelations(post);
  }

  async deletePost(id: string): Promise<void> {
    return await this.delete(id);
  }
}