import Dexie, {type Table } from 'dexie';
import type { Country, Fact } from './server/schema';

export class CountriesDatabase extends Dexie {
  countries!: Table<Country, number>;
  facts!: Table<Fact, number>;

  constructor () {
    super('CountriesDatabase');

    this.version(1).stores({
      countries: 'id',
      facts: 'id, countryId, difficulty'
    });
  }
}

export const db = new CountriesDatabase();

//TODO: Insert countries table into the DB


//TODO: Insert facts table into the DB
