import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { error } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	// Check for platform database
	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(event.platform.env.DB, sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
