<!-- routes/login/+page.svelte -->

<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<h1>Sign in</h1>
<a href="/login/google">Sign in with Google</a>

<form method="post" use:enhance>
    <button>Sign out</button>
</form>