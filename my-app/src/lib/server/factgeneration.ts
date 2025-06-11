import countries from '../../../content/independent.json' assert {type:'json'};
import { writeFile } from 'fs/promises';

//File for generating facts


const role_message = `You are You are model that is knowledgable about every country in the world. 
You generate interesting trivia facts about each country for use in a country guessing game`;

// Prepare JSONL lines
const lines: string[] = [];

//Generate a batch file
for(const country of countries){
    const countryName = country.name.common;
    const cca3 = country.cca3;
    const prompt = `Generate 5 to 15 interesting facts about ${countryName} (cca3="${cca3}"). 
        If the country is small or obscure, generate closer to 5 facts. If it’s large or well-known, generate closer to 15.

        Each fact should be an object with the following fields:
        - cca3 (string): always "${cca3}"
        - fact (string): start each fact with "This country..." and do NOT include the country's name.
        - difficulty (number from 0.0 to 10.0): how hard it is to guess the country from this fact.
        - category (string): one of "geography", "culture", "history", "economy", "demographics", "fun", or "misc"

        Facts should be fun, informative, and varied. Include cultural info, national dishes, animals, geography, history, famous people, landmarks, etc. Be creative.

        Return the facts as an array in JSON format under a top-level key called "facts". Example:
        {
            "facts": [
                { "cca3": "USA", "fact": "This country has the world's largest economy.", "difficulty": 5.0, "category": "economy" },
                ...
            ]
        }
    `
    const request = {
        "custom_id": cca3,
        "method": "POST", 
        "url": "/v1/chat/completions", 
        "body": {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": role_message},
                {"role": "user", "content": prompt}],"max_tokens": 1000}
    }
    lines.push(JSON.stringify(request));
}

// Write to file
await writeFile("requests.jsonl", lines.join("\n"));
console.log("All requests written to requests.jsonl");

