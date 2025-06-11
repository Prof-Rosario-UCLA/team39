import { CountriesDatabase } from "./dexie";
import type { Country } from "./dexie";
import type { gameState } from "./gameState";
import type { Fact } from "./server/schema";

export class IdbManager {
    #idb: CountriesDatabase;

    constructor(idb: CountriesDatabase) {
        this.#idb = idb;   
    }
    async getCountrys(): Promise<Country[]> {
        return this.#idb.countries.toArray();
    }
    async getFacts(cca3: string): Promise<any>{
        return this.#idb.facts.where('cca3').equals(cca3).toArray();
    }
    async getState(): Promise<any>{
        return this.#idb.meta.get({key: "state"});
    }
    async updateState(state: gameState): Promise<void>{
        this.#idb.meta.put({key:"state", value: state});
    }
    async clearState(): Promise<void>{
        this.#idb.meta.delete("state");
        this.initState();
    }
    async initState(): Promise<void>{
        const allKeys = await this.#idb.countries.toCollection().primaryKeys();
        const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
        const initGameState: gameState = {
            //random country code
            currCountry: randomKey,
            countriesGuessed: [],
            currFactsPtr: 0
        }
        await this.#idb.meta.put({key:"state", value: initGameState});
        console.log("initialized game state...")
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
        //Initialize game state if necessary
        const state = await this.#idb.meta.get({key: "state"});

        if(!state){
            //Pick a random country
           await this.initState();
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
    