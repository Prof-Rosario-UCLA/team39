import {db} from "./db.js";
import { countryTable, factTable } from "./schema.js";
import { categoryEnum, type NewFact } from "./schema.js";
import countries from '../../../content/independent.json' assert {type:'json'};
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';


export async function populateCountries(): Promise<void>{
    //Populates the country table, DO NOT RUN AGAIN UNLESS TABLE IS DROPPED
    for(const country of countries){
        const name = country.name.common;
        console.log(name);
        await db.insert(countryTable).values({name: name});
    }
    console.log(Object.keys(countries).length);
}

export async function populateFacts(): Promise<void>{
    //Populates the fact tables using the API
    const countriesFromDB = await db.select().from(countryTable);

    //Create a country common name to id map 
    const name_to_id = new Map<string, number>()
    for(const country of countriesFromDB){
        name_to_id.set(country.name, country.id);
    }
    //Iterating through the API results
    for(const country of countries){
        const capital: Array<string> = country.capital;
        const landlocked: boolean = country.landlocked;
        const area_km_squared: number = country.area;
        const population: number = country.population;
        const region: string = country.region;
        const subregion: string = country.subregion;
    }
    console.log(countriesFromDB);
}

export async function insertFact(fact: any): Promise<void>{
    await db.insert(factTable).values(fact);
}


async function enterFacts(){
    console.log("Running popoulateDB...")
    const rl = readline.createInterface({input, output});

    process.on('SIGINT', ()=>{
        console.log("Gracefully stopping script...");
        rl.close();
        setTimeout(() => process.exit(0), 100);
    })

    while(true){
        let countryId = await rl.question('CountryID?');
        let fact = await rl.question('Enter the fact...');
        let difficulty = await rl.question('Enter the difficulty (between 0.0-10.0)...');
        let category = await rl.question('Enter the category ["geography" | "culture" | "history" | "economy" | "demographics" | "fun" | "misc" ]...');
        let factObj = {
            fact: fact,
            countryId: parseInt(countryId),
            difficulty: difficulty,
            category: category
        }
        await insertFact(factObj);
        console.log(`Inserted fact <${countryId}, ${fact}, ${difficulty}, ${category}> into DB`);
    }

}

async function main(){
    await populateFacts();
}

main()
