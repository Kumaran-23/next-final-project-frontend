<script>
	import { accessTokenStore, logout } from '../utils/auth.js';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	export let data;

	let isLoggedIn = writable(false);
	let unsubscribe;

	console.log(data.provider);

	function updateLoginStatus(accessToken) {
		isLoggedIn.set(!!accessToken);
	}

	onDestroy(() => {
		// Clean up the subscription when the component is destroyed
		unsubscribe();
	});

	onMount(() => {
		unsubscribe = accessTokenStore.subscribe(updateLoginStatus);
		const storedAccessToken = localStorage.getItem('accessToken');
		updateLoginStatus(storedAccessToken);
	});

	async function handleLogout() {
		logout();
		isLoggedIn.set(false);
		await goto('/');
	}
</script>

<header class="header flex justify-between items-center py-4 px-6">
	<div class="logo text-white text-xl font-bold">Next Academy Project</div>
	<div class="flex space-x-4">
		{#if $isLoggedIn}
			<button class="text-white" on:click={() => handleLogout()}>SIGN OUT</button>
		{:else}
			<button class="text-white" on:click|preventDefault={() => goto('/sign-up')}>SIGN UP</button>
			<button class="text-white" on:click|preventDefault={() => goto('/login')}>LOGIN</button>
		{/if}
	</div>
</header>

<h1 class="text-center text-xl font-bold">Book Your Cleaning Services Now!</h1>

<div class="overflow-x-auto w-full">
	{#each data.provider as profile}
		<div class="flex flex-col mt-10">
			<div>
        <img src="{profile.photo_url}" alt="Profile Image" style="width: 200px; height: 150px;" />
				<a class="font-bold text-2xl" href="/provider-profile/{profile.id}"> {profile.name} </a>
				<div class="text-sm mt-1">
					<p>Hourly Rate: ${profile.hourly_rate}</p>
				</div>
        <div class="text-sm mt-1">
          <p>About the Provider: {profile.description}</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.header {
		background-color: black;
	}
</style>
