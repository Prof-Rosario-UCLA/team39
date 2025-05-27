// place files you want to import through the `$lib` alias in this folder.
import { createUser, getUserFromGoogleId } from "./server/crud";

console.log("Running index.ts...");

// await createUser("fsklfjeslkfjes", "gpayton");

const user = await getUserFromGoogleId("fsklfjeslkfjes");
console.log(user);

console.log("Finished running index.ts...")


