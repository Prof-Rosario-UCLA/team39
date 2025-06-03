<script lang="ts">
	export let searchTerm: any;
</script>

<div id="search-input-cont">
	<input type="text" 
				 id="search-field" 
				 class="w-full rounded-sm"
				 placeholder="Search for a Country" 
				 autocomplete="off"
				 bind:value={searchTerm}
				 on:input 
				 on:blur
				 on:focus/>
</div> 