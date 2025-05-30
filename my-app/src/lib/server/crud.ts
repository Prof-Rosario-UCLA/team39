import { db } from "./db";
import { userTable, sessionTable, factTable} from "./schema";
import type { User } from "./schema";
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

export async function getCountryFacts(countryId: number){
    console.log(countryId);
    return await db.select().from(factTable).where(eq(factTable.countryId, countryId)).orderBy(desc(factTable.difficulty));
}