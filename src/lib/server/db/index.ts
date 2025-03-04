import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { DatabaseClient } from './repositories';

// Export schema types
export * from './schema';

// Export database client and repositories
export * from './repositories';

// Export validators
export * from './validators';

// Create DrizzleD1Database client
export function createDrizzleDb(platformDb: D1Database) {
	if (!platformDb) {
		throw new Error('D1 database not found in platform env');
	}
	return drizzle(platformDb, { schema });
}

// Helper type for DrizzleD1Database client
export type DrizzleDb = ReturnType<typeof createDrizzleDb>;

// Create a complete database client with all repositories
export class Database {
	public readonly drizzle: DrizzleDb;
	public readonly client: DatabaseClient;

	constructor(platformDb: D1Database) {
		this.drizzle = createDrizzleDb(platformDb);
		this.client = new DatabaseClient(platformDb);
	}
}

// Helper to get a database connection with full type inference
export function getDatabase(platformDb: D1Database): Database {
	return new Database(platformDb);
}

// Helper to wrap database operations in error handling
export async function withDb<T>(
	platformDb: D1Database,
	operation: (db: Database) => Promise<T>
): Promise<T> {
	try {
		const db = new Database(platformDb);
		return await operation(db);
	} catch (error) {
		// Re-throw database errors with proper error handling
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Unknown database error');
	}
}

// Export convenience type for database operations
export type DbOperation<T> = (db: Database) => Promise<T>;
