
<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div class="flex justify-center">
    <section id="profile" class="flex-col">
        <h1 class="text-2xl text-green-800">Profile</h1>
        <form method="post" use:enhance>
            <button class="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500">Sign out</button>
        </form>
    </section>
</div>