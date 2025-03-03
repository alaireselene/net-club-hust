import { drizzle } from 'drizzle-orm/d1';

export function db(platformDb: D1Database) {
  if (!platformDb) {
    throw new Error('D1 database not found in platform env');
  }
  return drizzle(platformDb);
}

export type DbClient = ReturnType<typeof db>;