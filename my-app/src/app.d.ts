// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces


import type { User } from "$lib/server/schema/user";
import type { Session } from "$lib/server/schema/session";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
