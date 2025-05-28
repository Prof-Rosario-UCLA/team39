<!-- routes/login/+page.svelte -->

<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div class="flex justify-center">
	<section id="login" class="m-2">
		<h1 class="p-2 text-2xl text-green-800">Sign in</h1>
		<a href="/login/google" class="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500">Sign in with Google</a>
	</section>
</div>
