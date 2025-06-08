import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from "./lib/server/session";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("session") ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	//Supress chrome dev tools error
	if (
		event.url.pathname.startsWith(
			'/.well-known/appspecific/com.chrome.devtools'
		)
	) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}


	return resolve(event);


};