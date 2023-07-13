<script>
  import { accessTokenStore, logout } from '../utils/auth.js';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';

  let showAllProfiles = true;
  let isSearchSubmitted = false;

  // search stuff
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { time } from "../utils/time.js"
  import { DateInput } from 'date-picker-svelte';

  let providers = writable([]);
  let filteredProviders = writable([]);
  let day = new Date();
  let start_time = '';
  let end_time = '';
  let userAddress = '';

  let searchText = '';

  async function searchProviders() {
    console.log('Day:', day);
    console.log('Start Time:', start_time);
    console.log('End Time:', end_time);
    console.log('Address:', userAddress)
    const response = await fetch(PUBLIC_BACKEND_BASE_URL +'/providers/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ day, start_time, end_time, userAddress }),
    });

    if (response.ok) {
      console.log("working");
      const data = await response.json();
      console.log('Response Data:', data);
      
      filteredProviders.set(data);
      showAllProfiles = false;
      isSearchSubmitted = true;

      localStorage.setItem('searchDay', day);
      localStorage.setItem('startTime', start_time);
      localStorage.setItem('endTime', end_time);
      localStorage.setItem('userAddress', userAddress);
    } else {
      console.error('Search failed');
    }

    isSearchSubmitted = true; // Set the flag to true after search submission
  }

  let isLoggedIn = writable(false);
  let unsubscribe;

  function updateLoginStatus(accessToken) {
    isLoggedIn.set(!!accessToken);
  }

  onDestroy(() => {
    // Clean up the subscription when the component is destroyed
    unsubscribe();
  });

  onMount(async () => {
    unsubscribe = accessTokenStore.subscribe(updateLoginStatus);
    const storedAccessToken = localStorage.getItem('accessToken');
    updateLoginStatus(storedAccessToken);

    // Fetch all provider profiles on component mount
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + '/providers');
    if (response.ok) {
      const data = await response.json();
      providers.set(data);
      filteredProviders.set(data);
    }
  });

  async function handleLogout() {
    logout();
    isLoggedIn.set(false);
    await goto('/');
  }

  $: {
    const filtered = $providers.filter(provider => provider.name.includes(searchText));
    filteredProviders.set(filtered);
  }
</script>

<!-- Rest of the HTML code -->

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

<div class="container mx-auto py-10 px-5">
  <form on:submit|preventDefault={searchProviders} class="space-y-4">
    <div class="relative max-w-sm">
      <DateInput bind:value={day} />
      <div>
        <label for="start_time" class="block text-sm font-medium text-gray-700">Start Time</label>
        <select id="start_time" bind:value={start_time} required class="select select-bordered w-full max-w-xs">
          {#each time as t}
            <option value={t.id}>{t.t}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="end_time" class="block text-sm font-medium text-gray-700">End Time</label>
        <select id="end_time" bind:value={end_time} required class="select select-bordered w-full max-w-xs">
          {#each time as t}
            <option value={t.id}>{t.t}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
        <input id="address" bind:value={userAddress} type="text" required class="block w-full p-3 border border-gray-300 rounded-md">
      </div>
      <div>
        <button type="submit" class="w-full p-3 bg-blue-600 text-white rounded-md">Search Providers</button>
      </div>
    </div>
  </form>
</div>

<h1 class="text-center text-xl font-bold">Book Your Cleaning Services Now!</h1>

<div class="container mx-auto py-10 px-5">
  <ul>
    {#each $filteredProviders as provider}
      <li class="flex flex-wrap gap-5">
        <h2>{provider.name}</h2>
        <p>{provider.description}</p>
        <p>{provider.hourly_rate}</p>
        <p>
          <a href="/provider-profile/{provider.id}">
            <img src={provider.photo_url} alt="" class="w-[100px] h-[100px]" />
          </a>
        </p>
      </li>
    {/each}
  </ul>
</div>

<style>
  .header {
    background-color: black;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }

</style>
