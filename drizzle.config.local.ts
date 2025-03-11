import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	out: 'drizzle',
	schema: 'src/lib/server/db/schema.ts',
	dbCredentials: {
		url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/880df5de2b2406c060e232125a5d53acb5b9e86e7e2929ea11ba2179038d8cba.sqlite'
	}
});
