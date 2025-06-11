import 'dotenv/config';
import { write } from 'fs';
import { writeFile } from 'fs/promises';
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const batch = "batch_68491554ec6c8190a48e44fda2a4a768";

async function checkStatus(batch){
    const res = await openai.batches.retrieve(batch);
    console.log(res);
    return res;
}

async function getOutput(output_file_id){
    const fileResponse = await openai.files.content(output_file_id);
    const fileContents = await fileResponse.text();

    const output_path = `outputs/${output_file_id}.jsonl`;

    await writeFile(output_path, fileContents);

    console.log(`File written to ${output_path}`);
}

async function main(){
    const res = await checkStatus(batch);
    if(res.status === "completed"){
        console.log("Results are ready");
        await getOutput(res.output_file_id)
    }else{
        console.log("Results aren't ready yet")
    }
}
main();
