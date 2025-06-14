import { pgTable, serial, text, integer, timestamp, pgEnum, numeric, check, index, char} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const userTable = pgTable("user", {
	id: serial("id").primaryKey(),
	googleID: text("google_id").unique(),
	name: text("name")
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const countryTable = pgTable("country", {
	cca3: char("cca3", {length: 3}).primaryKey(),
	name: text("name")
		.notNull()
		.unique()
});

export const categoryEnum = pgEnum('category', ['geography', 'culture', 'history', 'economy', 'demographics', 'fun', 'misc'])

export const factTable = pgTable(
	"fact", 
	{
	id: serial("id").primaryKey(),
	cca3: char("cca3", {length: 3})
		.notNull()
		.references(() => countryTable.cca3),
	fact: text("fact").notNull(),
	difficulty: numeric("difficulty", {precision: 3, scale: 1}).default("0"),
	category: text("category")
	}, 
	(table) => [
    	check("difficulty_check", sql`${table.difficulty} >= 0 AND ${table.difficulty} <= 10`),
		index("cca3_index").on(table.cca3),
		index("category_index").on(table.category)
  	]
);

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Country = InferSelectModel<typeof countryTable>;
export type Fact = InferSelectModel<typeof factTable>;