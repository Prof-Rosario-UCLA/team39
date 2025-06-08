import { CountriesDatabase } from "./dexie";
import type { Country } from "./dexie";
import type { Fact } from "./server/schema";

export class IdbManager {
    #idb: CountriesDatabase;

    constructor(idb: CountriesDatabase) {
        this.#idb = idb;   
    }
    async getCountrys(): Promise<Country[]> {
        return this.#idb.countries.toArray();
    }
    async getFacts(): Promise<any>{
        return this.#idb.facts.toArray();
    }
    /**
     * Ensures valid data is in the cache and it hasn't expired
     */
    async prepareCache(): Promise<void>{
        const ttl = await this.#idb.meta.get({key: "ttl"});

        if(ttl){  
            //If the data has expired...
            if(Date.now() >= ttl.value.getTime()){
                console.log("data has expired...")
                this.fetchAndCache()
            } else{
                console.log("data is cached and valid!")
            }
        }
        else{
            //Fetch and insert data
            this.fetchAndCache();
        }
    } 
    /**
     * Fetches country data from the API and caches it
     */
    async fetchAndCache(): Promise<void>{
		//Fetch data from API
        console.log("fetcing and caching data...")
		const res1 = await fetch('/api/countries');

		if (!res1.ok) {
			throw new Error('Failed to fetch countries');
		}

		const res2 = await fetch('/api/facts');

		if (!res2.ok) {
			throw new Error('Failed to fetch facts');
		}

		const countries = await res1.json();
		const facts = (await res2.json()).facts;
        //24 hour TTL
        const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 )

		//Cache it with a TTL
        await this.#idb.countries.bulkPut(countries);
        await this.#idb.facts.bulkPut(facts);
        await this.#idb.meta.put({key: "ttl" , value: expirationDate})
    }
}
    