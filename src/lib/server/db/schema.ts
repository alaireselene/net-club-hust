import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export const newsCategory = sqliteTable('news_category', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	nameVi: text('name_vi').notNull(),
	nameEn: text('name_en').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const newsPost = sqliteTable('news_post', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	categoryId: text('category_id')
		.notNull()
		.references(() => newsCategory.id),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id),
	featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	publishedAt: integer('published_at', { mode: 'timestamp' })
}, (table) => ({
	categoryIdx: index('news_post_category_idx').on(table.categoryId),
	authorIdx: index('news_post_author_idx').on(table.authorId),
	publishedIdx: index('news_post_published_idx').on(table.publishedAt)
}));

export const newsTranslation = sqliteTable('news_translation', {
	id: text('id').primaryKey(),
	postId: text('post_id')
		.notNull()
		.references(() => newsPost.id),
	locale: text('locale').notNull(),
	title: text('title').notNull(),
	summary: text('summary').notNull(),
	content: text('content').notNull(),
	isAiTranslated: integer('is_ai_translated', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, (table) => ({
	postLocaleIdx: index('news_translation_post_locale_idx').on(table.postId, table.locale)
}));

export const eventCategory = sqliteTable('event_category', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	nameVi: text('name_vi').notNull(),
	nameEn: text('name_en').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const event = sqliteTable('event', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	categoryId: text('category_id')
		.notNull()
		.references(() => eventCategory.id),
	organizerId: text('organizer_id')
		.notNull()
		.references(() => user.id),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
	featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	publishedAt: integer('published_at', { mode: 'timestamp' })
}, (table) => ({
	categoryIdx: index('event_category_idx').on(table.categoryId),
	organizerIdx: index('event_organizer_idx').on(table.organizerId),
	dateIdx: index('event_date_idx').on(table.startDate, table.endDate),
	publishedIdx: index('event_published_idx').on(table.publishedAt)
}));

export const eventTranslation = sqliteTable('event_translation', {
	id: text('id').primaryKey(),
	eventId: text('event_id')
		.notNull()
		.references(() => event.id),
	locale: text('locale').notNull(),
	title: text('title').notNull(),
	summary: text('summary').notNull(),
	content: text('content').notNull(),
	location: text('location').notNull(),
	isAiTranslated: integer('is_ai_translated', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, (table) => ({
	eventLocaleIdx: index('event_translation_event_locale_idx').on(table.eventId, table.locale)
}));

export type NewsCategory = typeof newsCategory.$inferSelect;
export type NewsPost = typeof newsPost.$inferSelect;
export type NewsTranslation = typeof newsTranslation.$inferSelect;
export type EventCategory = typeof eventCategory.$inferSelect;
export type Event = typeof event.$inferSelect;
export type EventTranslation = typeof eventTranslation.$inferSelect;
