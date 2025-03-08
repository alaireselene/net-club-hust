import { defineConfig } from 'drizzle-kit';
if (
	!process.env.CLOUDFLARE_ACCOUNT_ID ||
	!process.env.CLOUDFLARE_DATABASE_ID ||
	!process.env.CLOUDFLARE_D1_TOKEN
)
	throw new Error('Missing Cloudflare connection credentials');

export default defineConfig({
	dialect: "sqlite",
	driver: "d1-http",
	out: "drizzle",
	schema: "src/lib/server/db/schema.ts",
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
});