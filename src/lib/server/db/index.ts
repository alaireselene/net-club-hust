import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Export schema types
export * from './schema';

// Create a drizzle client with our schema
export function getDb(platformDb: D1Database) {
	if (!platformDb) {
		throw new Error('D1 database not found in platform env');
	}
	return drizzle(platformDb, { schema });
}

// Helper type for drizzle client
export type DrizzleDb = ReturnType<typeof getDb>;

// Simple wrapper for database operations with error handling
export async function runQuery<T>(
	platformDb: D1Database,
	operation: (db: DrizzleDb) => Promise<T>
): Promise<T> {
	try {
		const db = getDb(platformDb);
		return await operation(db);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Unknown database error');
	}
}

// Export an initialized db instance for non-Edge environments
let _db: DrizzleDb | null = null;

export function initDb(platformDb: D1Database) {
	if (!_db) {
		_db = getDb(platformDb);
	}
	return _db;
}

export function getInitializedDb() {
	if (!_db) {
		throw new Error('Database not initialized. Call initDb first.');
	}
	return _db;
}
