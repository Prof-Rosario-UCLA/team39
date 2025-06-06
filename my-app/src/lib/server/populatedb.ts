import {db} from "./db.js";
import { factTable, countryTable } from "./schema.js";
import type { Fact } from "./schema.js";
import countries from '../../../content/independent.json' assert {type:'json'};
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { getCountries } from "@yusifaliyevpro/countries";
import { restCountryFields } from "$lib/dexie.js";


export async function insertFact(fact: any): Promise<void>{
    await db.insert(factTable).values(fact);
}

// async function populateCountries(){
//     for (const country of countries){
//         await db.insert(countryTable).values({cca3: country.cca3, name: country.name.common});
//     }
// }

async function enterFactsManual(){
    console.log("Enter facts...")

    const rl = readline.createInterface({input, output});
    process.on('SIGINT', ()=>{
        console.log("Gracefully stopping script...");
        rl.close();
        setTimeout(() => process.exit(0), 100);
    })

    while(true){
        let cca3 = await rl.question('cca3?');
        let fact = (await rl.question('Enter the fact...')).trim();
        let difficulty = await rl.question('Enter the difficulty (between 0.0-10.0)...');
        let category = await rl.question('Enter the category ["geography" | "culture" | "history" | "economy" | "demographics" | "fun" | "misc" ]...');
        let factObj = {
            cca3: cca3,
            fact: fact,
            difficulty: difficulty,
            category: category
        }
        await insertFact(factObj);
        console.log(`Inserted fact <${cca3}, ${fact}, ${difficulty}, ${category}> into DB`);
    }

}

async function main(){

    const res = await getCountries({
        independent: true,
        fields: restCountryFields,
    });

    console.log(res);

}

main()
