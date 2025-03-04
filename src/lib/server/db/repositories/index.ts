import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../schema';
import { UserRepository } from './user';
import { ClubRepository } from './club';
import { EventRepository } from './event';
import { PostRepository } from './post';
import { ResearchRepository } from './research';
import { ResourceRepository } from './resource';
import type { DbClient } from '../index';

export class DatabaseClient {
  private client: DbClient;

  // Repositories
  public readonly users: UserRepository;
  public readonly clubs: ClubRepository;
  public readonly events: EventRepository;
  public readonly posts: PostRepository;
  public readonly research: ResearchRepository;
  public readonly resources: ResourceRepository;

  constructor(platformDb: D1Database) {
    if (!platformDb) {
      throw new Error('D1 database not found in platform env');
    }

    this.client = drizzle(platformDb, { schema });

    // Initialize repositories
    this.users = new UserRepository(this.client);
    this.clubs = new ClubRepository(this.client);
    this.events = new EventRepository(this.client);
    this.posts = new PostRepository(this.client);
    this.research = new ResearchRepository(this.client);
    this.resources = new ResourceRepository(this.client);
  }

  public get db(): DbClient {
    return this.client;
  }
}

// Factory function for creating database client
export function createDbClient(platformDb: D1Database): DatabaseClient {
  return new DatabaseClient(platformDb);
}

// Export repository types
export type { UserRepository } from './user';
export type { ClubRepository } from './club';
export type { EventRepository } from './event';
export type { PostRepository } from './post';
export type { ResearchRepository } from './research';
export type { ResourceRepository } from './resource';

// Export input/output types
export type {
  CreateUserInput,
  UpdateUserInput
} from './user';

export type {
  CreateClubInput,
  UpdateClubInput,
  ClubWithMembers
} from './club';

export type {
  CreateEventInput,
  UpdateEventInput,
  EventWithSponsors
} from './event';

export type {
  CreatePostInput,
  UpdatePostInput,
  PostWithAuthor
} from './post';

export type {
  CreateResearchInput,
  UpdateResearchInput,
  ResearchWithCoauthors
} from './research';

export type {
  CreateResourceInput,
  UpdateResourceInput,
  ResourceWithUploader
} from './resource';