<script lang="ts">
    import { onMount } from 'svelte';
	import type { PageProps } from './$types';
    import { KnuthShuffle } from '$lib/helper';
    import Search from '../../components/Search.svelte';
	let { data }: PageProps = $props();
    import { fade } from 'svelte/transition';
    import Denque from 'denque';
    import { idb } from '$lib/dexie';

    //Game logic
    let answer = $state("");
    let correct = $state(false);
    let showAnswer = $state(false);
    //Countries array
    const countries = data.countries;
    
    //Generate an array of all country IDs minus the inital country fetched and perform Knuth Shuffle
    // const countryIdQueue = new Denque(KnuthShuffle([...Array(196).keys()].slice(1).filter((x)=> x != currCountry.id)));

    //Use a queue to hold prefetched countries
    const countryQueue = new Denque();

    //Stores only country strings
    const countriesGuessed = $state(Array<[string, boolean]>());
    
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

    //Search logic
    let searchTerm = $state("");
    let inputSelected = $state(false);
    let filteredCountries = $state(countries);

    function handleFocus() {
        console.log("HF")
        inputSelected = true;
    }
    function handleBlur() {
        console.log("HB")
        inputSelected = false;
    }
    // function handleResultMouseDown(res:any) {
    //     answer = res.name;
    //     checkAnswer(res.id);
    //     console.log("HRMD");
    // }

    // const searchCountries = () => {
    //     return filteredCountries = countries.filter(country => {
	// 		let countryName = country.name.toLowerCase();
	// 		return countryName.includes(searchTerm.toLowerCase());
	// 	});
    // }

    function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    // async function handleLoss(){
    //     countriesGuessed.push([currCountry.name, false]);
    //     await nextCountry();
    // }
    // function nextFact(){
    //     if (currFacts.isEmpty()){
    //         //Run out of facts, you failed to guess it!
    //         currFact = null;
    //         console.log("Out of facts!!! You lose!!!")
    //     } else{
    //         const fact = currFacts.shift();
    //         currFact = fact ? fact : null;
    //     }
    // }

    //Canvas Logic
	onMount(async () => {
		console.log('DOM has been mounted...');

    
        //Cache it with a TTL
		await idb.countries.bulkPut(data.countries);
        await idb.facts.bulkPut(data.facts);


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
<!--         
        <section id="fact" class="bg-slate-200 m-2 p-4 rounded-full ">
            <p>{@html currFact ? currFact.fact : "Ran out of facts..."}</p>
            {#if currFact}
            <button class="rounded-md p-2 bg-blue-300 hover:cursor-pointer" onclick={nextFact}>skip</button>
            {/if}
            {#if !currFact}
                <button class="rounded-md p-2 bg-blue-300 hover:cursor-pointer" onclick={handleLoss}>next country</button>
            {/if}
        </section> -->

        <!-- <section id="query-section">
            <Search bind:searchTerm on:input={searchCountries} on:focus={handleFocus} on:blur={handleBlur}></Search>
        </section> -->

        <section id="answer-section">
            {#if showAnswer}
            <div>
                <p id="answer" class="text-center font-bold {correct ? "text-green-500" : "text-red-500"}" out:fade>{answer}</p>
            </div>
            {/if}
        </section>
        
        <!-- Only show dropdown if there are still facts left -->
        <!-- {#if inputSelected && currFact}
        <section id="results-section" class="max-h-[30vh] md:max-w-[40vw] overflow-auto m-1">
            {#each filteredCountries as res}
                <button class="hover:bg-amber-100 hover:cursor-pointer rounded-md bg-slate-100 inline p-1 m-1" onmousedown={() => handleResultMouseDown(res)}>{res.name}</button>
            {/each}
        </section>
        {/if} -->

        <section class="table-section">
            <table class="table-auto m-4">
                <thead>
                    <tr>
                        <th>Countries Guessed</th>
                    </tr>
                </thead>
                <tbody>
                    {#each countriesGuessed as country}
                        <tr>
                            <td class="py-1 rounded-sm {country[1] ? "bg-green-200" : "bg-red-200"} m-2">{country[0]}</td>
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