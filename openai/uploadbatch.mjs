
import 'dotenv/config';
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


const name = "requests-v1.jsonl"

const file = await openai.files.create({
  file: fs.createReadStream(`batch/${name}`),
  purpose: "batch",
});

await writeFile(`uploadedFiles/file-${name}.json`, JSON.stringify(file, null, 2));
console.log("Written file to uploadedFiles");
console.log(file);