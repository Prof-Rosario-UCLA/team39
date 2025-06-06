import type { PageLoad } from './$types';
import { idb } from '$lib/dexie';

export const load: PageLoad = async ({ fetch }) => {

	let countries;
	let facts;
	//First check the cache

	const isCached = false;

	if(isCached){
		//Get data from IDB

	}
	else{
		//Fetch data from API
		const res1 = await fetch('/api/countries');

		if (!res1.ok) {
			throw new Error('Failed to fetch countries');
		}

		const res2 = await fetch('/api/facts');

		if (!res2.ok) {
			throw new Error('Failed to fetch countries');
		}

		countries = await res1.json();
		facts = (await res2.json()).facts;
	}

	return {
		countries: countries,
		facts: facts
	}
};