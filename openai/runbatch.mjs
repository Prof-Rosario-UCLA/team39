import 'dotenv/config';
import fs from "fs";
import OpenAI from "openai";
import { writeFile } from 'fs/promises';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const id = 'file-SLSpcTKi5WBqwHmFom9pAV'

const batch = await openai.batches.create({
  input_file_id: id,
  endpoint: "/v1/chat/completions",
  completion_window: "24h"
});

await writeFile(`batchObjects/${id}`, JSON.stringify(batch, null, 2));
console.log("Written batch to batchObjects");
console.log(batch);