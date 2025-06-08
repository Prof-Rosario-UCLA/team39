import Dexie, {type Table } from 'dexie';
import type { Fact } from './server/schema';
import type { CountryPicker } from '@yusifaliyevpro/countries/types';
import type { gameState } from './gameState';
import { defineFields } from '@yusifaliyevpro/countries';
export const restCountryFields = defineFields(["cca3", "name", "capital", "region", "subregion", "languages", "landlocked", "area", "flag", "population", "timezones", "continents", "flags"]);
export type Country = CountryPicker<typeof restCountryFields>;

//TODO add a gamestate table
export class CountriesDatabase extends Dexie {
  countries!: Table<Country, string>;
  facts!: Table<Fact, number>;
  meta!: Table<{key: string, value: any}, string>;

  constructor () {
    super('CountriesDatabase');

    this.version(1).stores({
      countries: 'cca3',
      facts: 'id, cca3',
      meta: 'key'
    });
  }
}

export const idb = new CountriesDatabase();

