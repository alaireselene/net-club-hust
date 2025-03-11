import { eq, and, sql } from 'drizzle-orm';
import { runQuery } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Event } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform, url }) => {
	if (!platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const startParam = url.searchParams.get('start');
	const endParam = url.searchParams.get('end');

	const start = startParam ? new Date(startParam) : new Date();
	const end = endParam ? new Date(endParam) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

	return await runQuery(platform.env.DB, async (db) => {
		const events = await db
			.select()
			.from(event)
			.where(
				and(
					eq(event.status, 'published'),
					sql`${event.startDate} >= ${Math.floor(start.getTime() / 1000)}`,
					sql`${event.startDate} <= ${Math.floor(end.getTime() / 1000)}`
				)
			)
			.orderBy(event.startDate);

		return {
			events: events.map((evt) => {
				const startTime = typeof evt.startDate === 'number' ? evt.startDate * 1000 : evt.startDate;
				const endTime = typeof evt.endDate === 'number' ? evt.endDate * 1000 : evt.endDate;

				return {
					...evt,
					startDate: new Date(startTime),
					endDate: new Date(endTime)
				};
			})
		};
	});
};
