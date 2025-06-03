import { getCountryFacts, getRandomCountry, getCountries, getCountryByID } from '$lib/server/crud';
import type { Country } from '$lib/server/schema';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params }) => {
  
    //Fetch Data
	const country = await getCountryByID(4);
	const facts = await getCountryFacts(country[0].id);
	const countries: Country[] = await getCountries();

	//Return Data
	return {
		country: country[0],
		facts: facts,
		countries: countries
	};


};