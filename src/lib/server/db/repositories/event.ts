import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { DbClient } from '../index';
import * as schema from '../schema';
import { BaseRepository } from './base';
import { DatabaseError, NotFoundError, UniqueConstraintError } from '../errors';

export type CreateEventInput = Omit<
  schema.Event,
  'id' | 'createdAt' | 'updatedAt' | 'status'
>;

export type UpdateEventInput = Partial<
  Omit<schema.Event, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
>;

export type EventWithSponsors = schema.Event & {
  sponsors: schema.Sponsor[];
};

export class EventRepository extends BaseRepository<schema.Event> {
  constructor(db: DbClient) {
    super(db, schema.event, 'Event');
  }

  async findBySlug(slug: string): Promise<EventWithSponsors> {
    try {
      const [event] = await this.db
        .select()
        .from(schema.event)
        .where(eq(schema.event.slug, slug));

      if (!event) {
        throw new NotFoundError('Event', slug);
      }

      const sponsors = await this.getEventSponsors(event.id);
      return { ...event, sponsors };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error fetching event by slug', error);
    }
  }

  private async getEventSponsors(eventId: string): Promise<schema.Sponsor[]> {
    try {
      const result = await this.db
        .select({
          sponsor: schema.sponsor
        })
        .from(schema.eventSponsor)
        .innerJoin(
          schema.sponsor,
          eq(schema.eventSponsor.sponsorId, schema.sponsor.id)
        )
        .where(eq(schema.eventSponsor.eventId, eventId));

      return result.map(r => r.sponsor);
    } catch (error) {
      throw new DatabaseError('Error fetching event sponsors', error);
    }
  }

  async createEvent(input: CreateEventInput): Promise<EventWithSponsors> {
    try {
      // Check unique constraints
      const existingSlug = await this.db
        .select()
        .from(schema.event)
        .where(eq(schema.event.slug, input.slug));

      if (existingSlug.length) {
        throw new UniqueConstraintError('Event', 'slug');
      }

      const event: schema.Event = {
        ...input,
        id: nanoid(),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.create(event);
      return { ...event, sponsors: [] };
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      throw new DatabaseError('Error creating event', error);
    }
  }

  async updateEvent(id: string, input: UpdateEventInput): Promise<EventWithSponsors> {
    try {
      const event = await this.update(id, {
        ...input,
        updatedAt: new Date()
      });
      const sponsors = await this.getEventSponsors(id);
      return { ...event, sponsors };
    } catch (error) {
      throw new DatabaseError('Error updating event', error);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      // First delete all event sponsor relationships
      await this.db
        .delete(schema.eventSponsor)
        .where(eq(schema.eventSponsor.eventId, id));

      // Then delete the event
      await this.delete(id);
    } catch (error) {
      throw new DatabaseError('Error deleting event', error);
    }
  }

  async addSponsor(eventId: string, sponsorId: string): Promise<void> {
    try {
      // Check if relationship already exists
      const existing = await this.db
        .select()
        .from(schema.eventSponsor)
        .where(
          and(
            eq(schema.eventSponsor.eventId, eventId),
            eq(schema.eventSponsor.sponsorId, sponsorId)
          )
        );

      if (existing.length) {
        throw new UniqueConstraintError('EventSponsor', 'eventId_sponsorId');
      }

      await this.db.insert(schema.eventSponsor).values({
        id: nanoid(),
        eventId,
        sponsorId,
        createdAt: new Date()
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      throw new DatabaseError('Error adding event sponsor', error);
    }
  }

  async removeSponsor(eventId: string, sponsorId: string): Promise<void> {
    try {
      await this.db
        .delete(schema.eventSponsor)
        .where(
          and(
            eq(schema.eventSponsor.eventId, eventId),
            eq(schema.eventSponsor.sponsorId, sponsorId)
          )
        );
    } catch (error) {
      throw new DatabaseError('Error removing event sponsor', error);
    }
  }

  async listByStatus(status: schema.Event['status']): Promise<EventWithSponsors[]> {
    try {
      const events = await this.db
        .select()
        .from(schema.event)
        .where(eq(schema.event.status, status));

      return Promise.all(
        events.map(async event => ({
          ...event,
          sponsors: await this.getEventSponsors(event.id)
        }))
      );
    } catch (error) {
      throw new DatabaseError('Error fetching events by status', error);
    }
  }

  async listByClub(clubId: string): Promise<EventWithSponsors[]> {
    try {
      const events = await this.db
        .select()
        .from(schema.event)
        .where(eq(schema.event.organizerId, clubId));

      return Promise.all(
        events.map(async event => ({
          ...event,
          sponsors: await this.getEventSponsors(event.id)
        }))
      );
    } catch (error) {
      throw new DatabaseError('Error fetching events by club', error);
    }
  }

  async findById(id: string): Promise<EventWithSponsors> {
    const event = await super.findById(id);
    const sponsors = await this.getEventSponsors(id);
    return { ...event, sponsors };
  }
}