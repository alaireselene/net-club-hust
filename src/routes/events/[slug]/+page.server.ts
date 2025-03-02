import { db } from '$lib/server/db';
import { event, eventTranslation } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export async function load({ params, locals }) {
  const { slug } = params;
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
        content: eventTranslation.content,
        location: eventTranslation.location,
        isAiTranslated: eventTranslation.isAiTranslated
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
    .where(eq(event.slug, slug));

  const foundEvent = events[0];

  if (!foundEvent || !foundEvent.translation) {
    throw error(404, {
      message: 'Event not found'
    });
  }

  return {
    event: foundEvent
  };
}