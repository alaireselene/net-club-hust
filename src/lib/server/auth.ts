import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { DatabaseError } from './db/errors';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export type AuthUser = {
	id: string;
	username: string;
	role: schema.User['role'];
	clubId: string | null;
};

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(platformDb: D1Database, token: string, userId: string) {
	const client = db(platformDb);
	try {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const session: schema.Session = {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
		};
		await client.insert(schema.session).values(session);
		return session;
	} catch (error) {
		throw new DatabaseError('Error creating session', error);
	}
}

export async function validateSessionToken(platformDb: D1Database, token: string) {
	const client = db(platformDb);
	try {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const [result] = await client
			.select({
				user: {
					id: schema.user.id,
					username: schema.user.username,
					role: schema.user.role,
					clubId: schema.user.clubId
				},
				session: schema.session
			})
			.from(schema.session)
			.innerJoin(schema.user, eq(schema.session.userId, schema.user.id))
			.where(eq(schema.session.id, sessionId));

		if (!result) {
			return { session: null, user: null };
		}
		const { session, user } = result;

		const sessionExpired = Date.now() >= session.expiresAt.getTime();
		if (sessionExpired) {
			await client.delete(schema.session).where(eq(schema.session.id, session.id));
			return { session: null, user: null };
		}

		const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
		if (renewSession) {
			session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
			await client
				.update(schema.session)
				.set({ expiresAt: session.expiresAt })
				.where(eq(schema.session.id, session.id));
		}

		return { session, user };
	} catch (error) {
		throw new DatabaseError('Error validating session', error);
	}
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(platformDb: D1Database, sessionId: string) {
	const client = db(platformDb);
	try {
		await client.delete(schema.session).where(eq(schema.session.id, sessionId));
	} catch (error) {
		throw new DatabaseError('Error invalidating session', error);
	}
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

// Role-based authorization helpers
export function isAdmin(user: AuthUser | null): boolean {
	return user?.role === 'admin';
}

export function isClubLeader(user: AuthUser | null): boolean {
	return user?.role === 'club_leader';
}

export function isAdvisor(user: AuthUser | null): boolean {
	return user?.role === 'advisor';
}

export function isMember(user: AuthUser | null): boolean {
	return user?.role === 'member';
}

export function isClubMember(user: AuthUser | null, clubId: string): boolean {
	return user?.clubId === clubId;
}

export function canManageClub(user: AuthUser | null, clubId: string): boolean {
	return (
		isAdmin(user) ||
		(isClubLeader(user) && user?.clubId === clubId)
	);
}
