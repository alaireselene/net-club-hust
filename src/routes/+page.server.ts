import { eq, count, and, isNotNull, sql } from 'drizzle-orm';
import { runQuery } from '$lib/server/db';
import { club, user, research, event, post } from '$lib/server/db/schema';
import type { Club, Post } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load = async ({ platform }) => {
	if (!platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	return await runQuery(platform.env.DB, async (db) => {
		// Get statistics
		const [clubCount, userCount, researchCount, eventCount] = await Promise.all([
			// Count total clubs
			db.select({ value: count() }).from(club),
			// Sum total members from all clubs
			db.select({ value: sql`sum(${club.memberCount})` }).from(club),
			// Count total research projects
			db.select({ value: count() }).from(research),
			// Count published events
			db.select({ value: count() }).from(event)
		]);

		// Get featured/latest news
		const featuredPosts: Post[] = await db.select().from(post).orderBy(post.createdAt).limit(3);

		// Get upcoming events
		// Use SQL template literal for timestamp comparison
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const upcomingEvents = await db
			.select()
			.from(event)
			.where(sql`${event.startDate} >= ${currentTimestamp}`)
			.orderBy(event.startDate)
			.limit(3);

		return {
			stats: [
				{ value: `${clubCount[0].value}`, label: 'Câu lạc bộ' },
				{ value: `${userCount[0].value}`, label: 'Thành viên' },
				{ value: `${researchCount[0].value}`, label: 'Dự án' },
				{ value: `${eventCount[0].value}`, label: 'Sự kiện' }
			],
			featuredPosts,
			upcomingEvents
		};
	});
};
