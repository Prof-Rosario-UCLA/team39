
import { getFacts } from "$lib/server/crud";
import { json } from '@sveltejs/kit';

export async function GET({url}) {

	const facts = await getFacts();

    return json({
        "facts": facts
    });
}