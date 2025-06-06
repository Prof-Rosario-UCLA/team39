import { getCountries } from '@yusifaliyevpro/countries';
import { restCountryFields } from '$lib/dexie.js';
import { json } from '@sveltejs/kit';


//Gets countries from REST Countries
export async function GET({url}) {

    const res = await getCountries({
		independent: true,
		fields: restCountryFields
	})

	return json(res);
}
