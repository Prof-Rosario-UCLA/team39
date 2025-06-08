import type { PageLoad } from './$types';
import { IdbManager } from '$lib/idbmanager';
import { idb } from '$lib/dexie';


export const ssr = false;
export const load: PageLoad = async () => {

	//Create an IDB manager and initialize it
	const idbManager = new IdbManager(idb);
	//Prepare the cache for use
	await idbManager.prepareCache()
	console.log("Cache ready for use...")

	return {
		idbManager: idbManager
	}
};