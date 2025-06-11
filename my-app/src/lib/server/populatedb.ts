import {db} from "./db.js";
import { factTable, countryTable } from "./schema.js";
import type { Fact } from "./schema.js";
import countries from '../../../content/independent.json' assert {type:'json'};
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { getCountries } from "@yusifaliyevpro/countries";
import { restCountryFields } from "$lib/dexie.js";
import * as fs from 'fs';
import * as rdln from 'readline';

const cca3_to_name = new Map(countries.map(item=> [item.cca3, item.name.common]));
export async function insertFact(fact: any): Promise<void>{
    await db.insert(factTable).values(fact);
}

export async function insertFactArray(facts: any[], cca3:any): Promise<void>{
    let difficulty = 10
    for(const fact of facts){
        const factObj:any = {
            fact: fact,
            difficulty: difficulty,
            cca3: cca3,
            category: "misc"
        }
        difficulty-=0.1;
        await db.insert(factTable).values(factObj);
    }
    
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

async function processJSONL(path:string, operation: (obj: any, cca3:any) => void){
    const fileStream = fs.createReadStream(path);
    const rl = rdln.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    const arr = []
    let i = 0;
    for await (const line of rl){
        if(line.trim()){
            try{
                const obj = JSON.parse(line);
                const cca3 = obj.custom_id;
                const facts = JSON.parse(obj['response']['body']['choices'][0]['message']['content']);
                const facts_array = facts.facts;
                await operation(facts_array, cca3);
                arr.push(0);
            } catch (err) {
                console.log(err);
                console.error("Something went wrong here, ", JSON.parse(line).custom_id);
            }

        }
    }
    console.log("Successfully updated: ", arr.length)
}



async function main(){
    console.log("hello...")
    const path = 'v4.jsonl'
    await processJSONL(path, insertFactArray);
}

main()
