// place files you want to import through the `$lib` alias in this folder.
import { getFactsByID } from "./server/crud";

console.log("Running index.ts...");

const cca3="ERI";
const res = await getFactsByID(cca3);
console.log(res);

console.log("Finished running index.ts...")


