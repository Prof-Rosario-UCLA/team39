import { db } from '$lib/server/db';
import { getCountryFacts } from '$lib/server/crud';
import type { PageServerLoad } from '../$types';
import { maxCountryID, getRandomIntInclusive } from '$lib/helper';

export const load: PageServerLoad = async ({ params }) => {
    const id = getRandomIntInclusive(1, maxCountryID)
	//Currently hardcoded
    const facts = await getCountryFacts(4)
	return {
		facts: facts
	};
};