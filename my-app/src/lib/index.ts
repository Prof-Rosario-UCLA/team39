// place files you want to import through the `$lib` alias in this folder.
// import { createUser, getUserFromGoogleId, getCountryFacts } from "./server/crud";

console.log("Running index.ts...");

const countryIdQueue = [...Array(196).keys()].slice(1).filter((x)=> x != 4)
console.log(countryIdQueue);

console.log("Finished running index.ts...")


