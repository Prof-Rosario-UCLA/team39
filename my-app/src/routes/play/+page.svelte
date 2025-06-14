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
    import type { gameState } from '$lib/gameState';
    import { ConsoleLogWriter } from 'drizzle-orm';
    import { KnuthShuffle } from '$lib/helper';

    let answer = $state("");
    let correct = $state(false);
    let showAnswer = $state(false);
    let loss = $state(false);

    const idbManager = data.idbManager;

    let countries: Country[] = $state([]);
    let countriesGuessed: Country[] = $state([]);
    let currCountry: Country | undefined  = $state(undefined);
    let currFactsPtr = $state(0);
    let currFacts: Fact[] = $state([]);

    let countriesGuessedSet = $derived(new Set(countriesGuessed.map(item => item.cca3)));
    let countriesMap = $derived(new Map(countries.map(item => [item.cca3, item])));
    let countriesLeft = $derived(countries.filter(item => !countriesGuessedSet.has(item.cca3)));
    
    let canvas: HTMLCanvasElement;
    let showFlag = $derived((currCountry && (showAnswer && correct)) || loss);

    //Update canvas
    $effect(() => {
        const country = currCountry;
        if(currCountry && showFlag){
            drawSvgOnCanvas(currCountry.flags.svg, canvas);
        } else{
            drawSvgOnCanvas('/qm.svg', canvas);
        }
	});

    //Update state
    $effect(() => {
        if(!currCountry && countries.length === 0){
            ;
        } else {
            //Only update state if it's not initial state...
            const state: gameState  = {
            currCountry: currCountry ? currCountry.cca3 : currCountry,
            countriesGuessed: countriesGuessed.map(item => item.cca3),
            currFactsPtr: currFactsPtr
            };

            (async () => {
                try{
                    await idbManager.updateState(state);
                    console.log("updated state in IDB");
                }
                catch(err){
                    console.log("failed to update state in idb: ", err);
                } 
            })();
        }     
	});

    function drawSvgOnCanvas(svgPath: string, canvas:HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("2D context not available");
            return;
        }

        const img = new Image();
        img.onload = () => {
            const { width, height } = canvas;

            // Scale SVG to fit inside canvas while preserving aspect ratio
            const scale = Math.min(width / img.width, height / img.height);
            const x = (width - img.width * scale) / 2;
            const y = (height - img.height * scale) / 2;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        img.crossOrigin = "anonymous"; // Avoid CORS issues if exporting canvas
        img.src = svgPath;
    }
    function codeToCountry(cca3: string): Country | undefined {
        return countriesMap.get(cca3);
    }
    function codesToCountrys(arr: Array<string>): Array<Country> {
        let resultArray: Array<Country> = [];
        for(const cca3 of arr){
            const country = codeToCountry(cca3);
            if(country){
                resultArray.push(country);
            }
        }
        return resultArray;
    }
    function randomCountry(){
        //Return a random country from countries
        return countries[Math.floor(Math.random() * countries.length)];
    }
    //Initialize data using idb
    onMount(async() =>{
        console.log("onMount()...");
        if(countries.length === 0){
            //Shuffle countries to ensure randomness
            countries = KnuthShuffle(await idbManager.getCountrys());
            console.log("populated countries...");
        }
        //Get state
        console.log("fetching state...");
        const state: gameState = (await idbManager.getState()).value;
        console.log(state)
        countriesGuessed = codesToCountrys(state.countriesGuessed);
        if(state.currCountry){
            //If state is a country.
            currCountry = codeToCountry(state.currCountry);
        }else if(!state.currCountry && countriesGuessed.length === 0){
            //If we're in initial state.
            currCountry = randomCountry();
        }else{
            //If we've guessed countries but currCountry is undefined, only happens when all countries are guessed.
            currCountry = undefined;
        }
        //Get facts
        if(currCountry){
            currFacts = await idbManager.getFacts(currCountry?.cca3);
            console.log("got facts...");
        }
        else{
            console.log("currCountry is undefined... no facts");
        }
    })

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
    function handleResultMouseDown(res:Country) {
        answer = res.name.common;
        checkAnswer(res.cca3);
        console.log("HRMD");
    }
    const searchCountries = () => {
        return filteredCountries = countriesLeft.filter(country => {
			let countryName = country.name.common.toLowerCase();
			return countryName.includes(searchTerm.toLowerCase());
		});
    }
    function wait(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function checkAnswer(cca3:string){
        if(currCountry){
            if(cca3 === currCountry.cca3){
                console.log("Correct")
                correct = true;
            } else{
                correct = false;
                console.log("Incorrect Guess")
            }
            //Once correctness is checked show the answer.
            showAnswer = true;
            await wait(2000);
            showAnswer = false;
            if(correct){
                await handleWin();
            }
        }
    
    }
    async function getNewCountry(){
        //First reset facts pointer
        console.log("GAMEPLAY: RESETTING CURRFACTSPTR")
        currFactsPtr = 0;
        console.log("GAMEPLAY: GETTING NEW COUNTRIES")
        //Get a new country from countries left
        console.log(countriesLeft.length);
        currCountry = countriesLeft[(getRandomInt(0, countriesLeft.length))];
        await getNewFacts();
    }
    async function getNewFacts(){
        console.log("GAMEPLAY: GETTING NEW FACTS")
        if(currCountry){
            currFacts = await idbManager.getFacts(currCountry?.cca3);
        } 
    }
    async function handleLoss(){
        loss = false;
        if(currCountry){
            //Get new countries and facts
            await getNewCountry();
        }
    }
    async function handleWin(){
        if(currCountry){
            countriesGuessed.push(currCountry);
            //Get new countries and facts
            await getNewCountry();
        }
    }
    async function resetState(){
        countriesGuessed = [];
        currCountry = randomCountry();
        await getNewFacts();
    }
    function nextFact(){
        console.log("GAMEPLAY: incremeting currFactsPtrs")
        currFactsPtr+=1;
        console.log(currFactsPtr)
        if(currFactsPtr === currFacts.length){
            loss = true;
        }
    }
</script>

<section id="gameplay" class="flex justify-center pt-3 flex-col md:flex-row md:justify-evenly">
    <div class="flex md:min-w-[40vw] md:max-w-[50vw]">
        <section id="main-gampeplay">
            <section id="canvas-section"class="flex justify-center">
                <canvas id="canvas" width="300" height="150" bind:this={canvas} aria-label="Canvas showing the country flag">{currCountry?.flags.alt}</canvas>   
            </section>
            
            {#if countriesLeft.length > 0}
            <section id="fact-section" class="bg-slate-200 m-2 p-4 md:max-w-[50vw] md:min-w[50vw]" aria-label="A fact about the current country is displayed">
                <div class="md:w-[500px] break-words whitespace-normal">
                    <p>{@html currFactsPtr < currFacts.length ? currFacts[currFactsPtr].fact : `You did not guess it! The country was: ${currCountry?.name.common}`}</p>
                </div>
                {#if currFacts.length > 0 && currFactsPtr < currFacts.length}
                <button class="rounded-md p-2 bg-blue-300 hover:cursor-pointer" onclick={nextFact}>skip</button>
                {:else}
                <button class="rounded-md p-2 bg-blue-300 hover:cursor-pointer" onclick={handleLoss}>next country</button>
                {/if}
            </section>
            {/if}

            <section id="options" class="flex justify-center p-2" aria-label="Reset Button">
                <button class="rounded-md bg-red-400 p-2 cursor-pointer" onclick={resetState}>Reset</button>
            </section>

            <section id="query-section md:max-w-[40vw]" aria-label="Search Bar for countries">
                <Search bind:searchTerm on:input={searchCountries} on:focus={handleFocus} on:blur={handleBlur}></Search>
            </section>

            <section id="answer-section" aria-label="Answer Feedback here">
                {#if showAnswer}
                <div>
                    <p id="answer" class="text-center font-bold {correct ? "text-green-500" : "text-red-500"}" out:fade>{answer} {correct ? "(correct)" : "(incorrect)"}</p>
                </div>
                {/if}
            </section>
            
            <!-- Only show dropdown if there are still facts left -->
            {#if inputSelected }
            <section id="results-section" class="max-h-[30vh] md:max-w-[35vw] overflow-auto m-1 break-words" aria-label="Dropdown with countries">
                {#each filteredCountries as res}
                    <button class="hover:bg-amber-100 hover:cursor-pointer rounded-md bg-slate-100 inline p-1 m-1" onmousedown={() => handleResultMouseDown(res)}>{res.name.common}</button>
                {/each}
            </section>
            {/if}
        </section>
    </div>
       
      
    <section class="table-section" aria-label="List of countries correclty guessed">
        <table class="table-auto m-4">
            <thead>
                <tr>
                    <th>Countries Guessed <span class="text-cyan-800 text-2xl px-1">{@html countriesGuessed.length}</span></th>
                </tr>
            </thead>
            <tbody>
                {#each countriesGuessed.slice().reverse() as country}
                    <tr>
                        <td class="py-1 rounded-sm m-2">{country.name.common} {country.flag}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</section>

<style>
 
</style>