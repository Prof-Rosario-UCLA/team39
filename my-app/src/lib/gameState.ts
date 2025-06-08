//TODO

//Create a game state object for storage in IDB

export interface gameState {
    countriesGuessed: Array<string>,
    currCountry: string,
    currFactsPtr: number
}