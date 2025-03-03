import { sqliteTable, text, integer, index, uniqueIndex, real } from 'drizzle-orm/sqlite-core';

// User & Authentication
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	fullName: text('full_name').notNull(),
	passwordHash: text('password_hash').notNull(),
	avatarUrl: text('avatar_url'),
	role: text('role', { enum: ['admin', 'club_leader', 'advisor', 'member'] })
		.notNull()
		.default('member'),
	clubId: text('club_id').references(() => club.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Clubs & Network
export const club = sqliteTable('club', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description').notNull(),
	logoUrl: text('logo_url'),
	establishedAt: integer('established_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Partners
export const partner = sqliteTable(
	'partner',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		type: text('type', { enum: ['university', 'company', 'institute', 'club', 'other'] }).notNull(),
		description: text('description').notNull(),
		website: text('website'),
		logoUrl: text('logo_url'),
		// Location data for map display
		address: text('address').notNull(),
		city: text('city').notNull(),
		country: text('country').notNull(),
		latitude: real('latitude').notNull(),
		longitude: real('longitude').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		index('partner_location_idx').on(table.latitude, table.longitude),
		index('partner_type_idx').on(table.type)
	]
);

// Sponsors
export const sponsor = sqliteTable('sponsor', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	logoUrl: text('logo_url').notNull(),
	websiteUrl: text('website_url').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Events
export const event = sqliteTable(
	'event',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		slug: text('slug').notNull().unique(),
		shortDescription: text('short_description').notNull(),
		description: text('description').notNull(),
		location: text('location').notNull(),
		startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
		endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
		type: text('type', {
			enum: ['workshop', 'competition', 'cultural', 'research', 'synposium']
		}).notNull(),
		status: text('status', { enum: ['draft', 'published', 'cancelled'] })
			.notNull()
			.default('draft'),
		organizerId: text('organizer_id')
			.notNull()
			.references(() => club.id),
		imageUrl: text('image_url'),
		capacity: integer('capacity'),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		uniqueIndex('event_slug_idx').on(table.slug),
		index('event_date_idx').on(table.startDate)
	]
);

export const eventSponsor = sqliteTable(
	'event_sponsor',
	{
		id: text('id').primaryKey(),
		eventId: text('event_id')
			.notNull()
			.references(() => event.id),
		sponsorId: text('sponsor_id')
			.notNull()
			.references(() => sponsor.id),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		uniqueIndex('event_sponsor_unique_idx').on(table.eventId, table.sponsorId),
		index('event_sponsor_event_idx').on(table.eventId)
	]
);

// Student Research
export const research = sqliteTable(
	'research',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		abstract: text('abstract').notNull(),
		doiLink: text('doi_link'),
		projectLeadId: text('project_lead_id')
			.notNull()
			.references(() => user.id),
		advisorId: text('advisor_id')
			.notNull()
			.references(() => user.id),
		status: text('status', { enum: ['active', 'completed', 'published'] })
			.notNull()
			.default('active'),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		index('research_project_lead_idx').on(table.projectLeadId),
		index('research_advisor_idx').on(table.advisorId)
	]
);

export const researchCoauthor = sqliteTable(
	'research_coauthor',
	{
		id: text('id').primaryKey(),
		researchId: text('research_id')
			.notNull()
			.references(() => research.id),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		uniqueIndex('research_coauthor_unique_idx').on(table.researchId, table.userId),
		index('research_coauthor_research_idx').on(table.researchId)
	]
);

// News/Blog Content
export const post = sqliteTable(
	'post',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		slug: text('slug').notNull().unique(),
		shortDescription: text('short_description'),
		content: text('content').notNull(),
		excerpt: text('excerpt'),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id),
		clubId: text('club_id').references(() => club.id),
		category: text('category', {
			enum: ['news', 'announcement', 'research', 'achievement']
		}).notNull(),
		status: text('status', { enum: ['draft', 'published', 'archived'] })
			.notNull()
			.default('draft'),
		featuredImageUrl: text('featured_image_url'),
		publishedAt: integer('published_at', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		uniqueIndex('post_slug_idx').on(table.slug),
		index('post_published_idx').on(table.publishedAt)
	]
);

// Resources & Facilities
export const resource = sqliteTable('resource', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	type: text('type', { enum: ['document', 'presentation', 'video', 'link'] }).notNull(),
	url: text('url').notNull(),
	uploaderId: text('uploader_id')
		.notNull()
		.references(() => user.id),
	clubId: text('club_id').references(() => club.id),
	category: text('category', { enum: ['tools', 'training', 'documentation', 'paper'] }).notNull(),
	accessLevel: text('access_level', { enum: ['public', 'members', 'leaders'] })
		.notNull()
		.default('members'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const facility = sqliteTable('facility', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	location: text('location').notNull(),
	capacity: integer('capacity'),
	status: text('status', { enum: ['available', 'maintenance', 'unavailable'] })
		.notNull()
		.default('available'),
	imageUrl: text('image_url')
});

// Type Exports
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Club = typeof club.$inferSelect;
export type Partner = typeof partner.$inferSelect;

export type Sponsor = typeof sponsor.$inferSelect;
export type Event = typeof event.$inferSelect;
export type EventSponsor = typeof eventSponsor.$inferSelect;
export type Research = typeof research.$inferSelect;
export type ResearchCoauthor = typeof researchCoauthor.$inferSelect;
export type Post = typeof post.$inferSelect;
export type Resource = typeof resource.$inferSelect;
export type Facility = typeof facility.$inferSelect;
