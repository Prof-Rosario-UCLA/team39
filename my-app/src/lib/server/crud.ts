import { db } from "./db";
import { userTable, sessionTable, factTable, countryTable} from "./schema";
import { getRandomIntInclusive, maxCountryID } from "$lib/helper";
import type { User, Country } from "./schema";
import { eq, desc } from "drizzle-orm";
//Methods for CRUD opertaions on the database

//Tested... returns entire row that has this id
export async function getUserFromGoogleId(googleUserId: string):  Promise<User | null> {
    const users = await db.select().from(userTable).where(eq(userTable.googleID, googleUserId)).limit(1);
    return users[0] ?? null;
}
//Tested... creates user and returns 
export async function createUser(googleUserId: string, name: string): Promise<User> {
        const user = await db.insert(userTable).values({
        googleID: googleUserId,
        name: name
    }).returning()
    return user[0] ?? null;
}

export async function getRandomCountry(){
    const id = getRandomIntInclusive(1, maxCountryID);
    return await db.select().from(countryTable).where(eq(countryTable.id, id))
}

export async function getCountryByID(id:number){
    return await db.select().from(countryTable).where(eq(countryTable.id, id))
}


export async function getCountryFacts(countryId: number){
    console.log(countryId);
    return await db.select().from(factTable).where(eq(factTable.countryId, countryId)).orderBy(desc(factTable.difficulty));
}

export async function getCountries(){
    return await db.select().from(countryTable);
}