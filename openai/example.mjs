import 'dotenv/config';
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import countries from '../my-app/content/countries.json' assert {type:'json'};

function createStructuredPrompt(countryName, cca3) {
  return `Generate 5 to 15 interesting facts about ${countryName} (cca3="${cca3}"). 
        If the country is small or obscure, generate closer to 5 facts. If it’s large or well-known, generate closer to 15.

        Each fact should be an object with the following fields:
        - cca3 (string): always "${cca3}"
        - fact (string): start each fact with "This country..." and do NOT include the country's name.
        - difficulty (number from 0.0 to 10.0): how hard it is to guess the country from this fact.
        - category (string): one of "geography", "culture", "history", "economy", "demographics", "fun", or "misc"

        Facts will be shown in decreasing order of difficulty. Generate difficult facts first then decrease difficulty. The last fact should be a layup, meaning very easy to get.
        Facts should be fun, informative, and varied. Include cultural info, national dishes, animals, geography, history, famous people, landmarks, etc. Be creative.

        Return the facts as an array in JSON format under a top-level key called "facts". Example:
        {
            "facts": [
                { "cca3": "USA", "fact": "This country has the world's largest economy.", "difficulty": 5.0, "category": "economy" },
                ...
            ]
        }`
}

async function queryGPT(countryName, cca3) {

    const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const response = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You are model that is knowledgable about every country in the world. You generate interesting trivia facts about each country for use in a country guessing game.",
            },
            {
                role: "user",
                content: createStructuredPrompt(countryName, cca3)
            },
        ],
    });
    let content = response.choices[0].message.content;
    return content
}


async function main(){
    // for(const country of countries){
    //     console.log(country.name.common, ": ", country.cca3);
    // }
    let countryName = 'South Africa';
    let cca3 = 'ZAF';
    const res = await queryGPT(countryName, cca3);
    const result_json = JSON.parse(res)
    console.log(result_json);
}

main();



