<script lang="ts">
    import { onMount } from 'svelte';
	import type { PageProps } from './$types';
    import Search from '../../components/Search.svelte';
	let { data }: PageProps = $props();
    import { fade } from 'svelte/transition';
    import Denque from 'denque';
    import { idb, type Country } from '$lib/dexie';
    import type { Fact } from '$lib/server/schema';
    import { getRandomInt } from '$lib/helper';


    let answer = $state("");
    let correct = $state(false);
    let showAnswer = $state(false);

    const idbManager = data.idbManager;

    let countries: Country[] = $state([]);
    let countriesGuessed: Country[] = $state([]);
    let facts: Fact[] = $state([]);

    let countriesGuessedSet = $derived(new Set(countriesGuessed.map(item => item.cca3)))
    let countriesLeft = $derived(countries.filter(item => !countriesGuessedSet.has(item.cca3))); 
    let currCountry = $derived(countriesLeft.at(getRandomInt(0, countriesLeft.length)));
    let currFacts = $derived(facts.filter(fact => fact.cca3 === currCountry?.cca3));
    let currFactsPtr = $state(0);

    //Initialize data using idb
    onMount(async() =>{
        if(countries.length === 0){
            countries = await idbManager.getCountrys();
            console.log("populated countries...")
        }
        if(facts.length === 0){
            facts = await idbManager.getFacts();
            console.log("populated facts...")
        }
    })
    
    // async function fetchNextCountry(): Promise<boolean> {
    //     //Fetches next country using randomized countryIdQueue, push it onto countryqueue

    //     //Returns False is no countries were fetched
    //     if(countryIdQueue.isEmpty()){
    //         return false;
    //     }

    //     let countryId = countryIdQueue.shift();
    //     const res = await fetch(`/api/next-country?id=${countryId}`);
    //     const country =  await res.json();
    //     countryQueue.push(country);
    //     return true;
    // }
    
    // async function nextCountry(): Promise<void> {
    //     //Changes to the next country
    //     if(countryQueue.isEmpty()){
    //         console.log("There are no more countries left...")
    //     }
    //     //Pop from the queue
    //     const nextCountry = countryQueue.shift();

    //     //Update state
    //     if(nextCountry){
    //         currCountry = nextCountry.country;
    //         console.log("Next contry is... ", currCountry.name);
    //         currFacts = nextCountry.facts;
    //         if(!currFacts){
    //             currFact = null;
    //         } else {
    //             const fact = currFacts.shift();
    //             currFact = fact ? fact : null;
    //         }
    //     }
    //     //Fetch the next country into the queue
    //     await fetchNextCountry();
    // }

    //________ Search logic _________
    let searchTerm = $state("");
    let inputSelected = $state(false);
    let filteredCountries: Country[] = $derived(countriesLeft);

    function handleFocus() {
        console.log("HF")
        inputSelected = true;
    }
    function handleBlur() {
        console.log("HB")
        inputSelected = false;
    }
    function handleResultMouseDown(res:any) {
        answer = res.name;
        // checkAnswer(res.id);
        console.log("HRMD");
    }
    const searchCountries = () => {
        return filteredCountries = countriesLeft.filter(country => {
			let countryName = country.name.common.toLowerCase();
			return countryName.includes(searchTerm.toLowerCase());
		});
    }

    // async function checkAnswer(id:number){
        
    //     if(id === currCountry.id){
    //         console.log("Correct")
    //         correct = true;
    //         //Mark country as guessed
    //         countriesGuessed.push([currCountry.name, true]);
    //         //Move to the next country
    //         nextCountry();
    //     } else{
    //         correct = false;
    //         console.log("Incorrect Guess")
    //     }
    //     //Once correctness is checked show the answer.
    //     showAnswer = true;
    //     await wait(500);
    //     showAnswer = false;
    // }

    async function handleLoss(){
        if(currCountry){
            countriesGuessed.push(currCountry);
        }
        //Reset currFactsPtr
        currFactsPtr = 0;
    }
    function nextFact(){
        console.log("incremeneting currFactsPtrs")
        currFactsPtr+=1;
        console.log(currFactsPtr)
    }

    //Canvas Logic
	onMount(async () => {
		console.log('DOM has been mounted...');
        const myCanvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = myCanvas.getContext("2d");
        if(ctx){

        }
	});

</script>

<section id="gameplay" class="flex justify-center">
    <div class="flex-col md:min-w-[40vw]">

        <section class="flex justify-center">
            <canvas id="canvas" width="300" height="150" class="">This canvas shows the game state</canvas>   
        </section>
        
        {#if countriesLeft.length > 0}
        <section id="fact-section" class="bg-slate-200 m-2 p-4 rounded-full ">
            <p>{ currFactsPtr < currFacts.length ? currFacts[currFactsPtr].fact : "Ran out of facts..."}</p>
            {#if currFacts.length > 0 && currFactsPtr < currFacts.length}
            <button class="rounded-md p-2 bg-blue-300 hover:cursor-pointer" onclick={nextFact}>skip</button>
            {:else}
            <button class="rounded-md p-2 bg-blue-300 hover:cursor-pointer" onclick={handleLoss}>next country</button>
            {/if}
        </section>
        {/if}

        <section id="query-section">
            <Search bind:searchTerm on:input={searchCountries} on:focus={handleFocus} on:blur={handleBlur}></Search>
        </section>

        <section id="answer-section">
            {#if showAnswer}
            <div>
                <p id="answer" class="text-center font-bold {correct ? "text-green-500" : "text-red-500"}" out:fade>{answer}</p>
            </div>
            {/if}
        </section>
        
        <!-- Only show dropdown if there are still facts left -->
        {#if inputSelected }
        <section id="results-section" class="max-h-[30vh] md:max-w-[40vw] overflow-auto m-1">
            {#each filteredCountries as res}
                <button class="hover:bg-amber-100 hover:cursor-pointer rounded-md bg-slate-100 inline p-1 m-1" onmousedown={() => handleResultMouseDown(res)}>{res.name.common}</button>
            {/each}
        </section>
        {/if}

        <p>{currCountry ? currCountry.name.common : "No more countries left"}</p>
        {#each currFacts as fact}
              <p>{fact.fact}</p>
        {/each}
      
        <section class="table-section flex flex-row">
            <table class="table-auto m-4">
                <thead>
                    <tr>
                        <th>Countries Guessed</th>
                    </tr>
                </thead>
                <tbody>
                    {#each countriesGuessed as country}
                        <tr>
                            <td class="py-1 rounded-sm m-2">{country.name.common}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>
    </div>
</section>

<style>
    canvas {
        border: 1px solid black;
    }
</style>