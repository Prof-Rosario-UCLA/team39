
import { getCountryByID, getCountryFacts } from "$lib/server/crud";
import { json, error } from '@sveltejs/kit';

export async function GET({url}) {
    const idParam = url.searchParams.get('id');
    if (!idParam) {
        throw error(400, 'Missing country ID');
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        throw error(400, 'Invalid country ID');
    }

    const country = await getCountryByID(id);
	const facts = await getCountryFacts(country[0].id);

    return json({
        "country": country[0],
        "facts": facts[0]
    });
}