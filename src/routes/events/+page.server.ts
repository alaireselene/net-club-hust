import { db } from '$lib/server/db';
import { event, eventTranslation } from '$lib/server/db/schema';
import { desc, eq, and, gte, isNotNull } from 'drizzle-orm';

export async function load({ locals }) {
  const { locale } = locals;

  const events = await db
    .select({
      id: event.id,
      slug: event.slug,
      startDate: event.startDate,
      endDate: event.endDate,
      featured: event.featured,
      translation: {
        title: eventTranslation.title,
        summary: eventTranslation.summary,
        location: eventTranslation.location
      }
    })
    .from(event)
    .leftJoin(
      eventTranslation,
      and(
        eq(event.id, eventTranslation.eventId),
        eq(eventTranslation.locale, locale)
      )
    )
    .where(
      and(
        isNotNull(event.publishedAt),
        gte(event.endDate, new Date())
      )
    )
    .orderBy(desc(event.startDate));

  return {
    events
  };
}