<script lang="ts">
    import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	onMount(() => {
		console.log('the component has mounted');
        const myCanvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = myCanvas.getContext("2d");
        if(ctx){

        }
	});

</script>

<section id="gameplay">
    <div class="flex justify-center">
        <canvas id="canvas" width="300" height="150">This canvas shows the game state</canvas>
    </div>
    <div>{@html data.facts[0].fact}</div>
</section>

<style>
    canvas {
        border: 1px solid black;
    }
</style>