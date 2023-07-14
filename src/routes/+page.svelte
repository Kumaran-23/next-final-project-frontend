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
    if(accessToken) {
      isLoggedIn.set(true);
      console.log($isLoggedIn);
    }
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
    console.log($isLoggedIn);
    await goto('/');
  }

  $: {
    const filtered = $providers.filter(provider => provider.name.includes(searchText));
    filteredProviders.set(filtered);
  }

  // Add CSS class to the <ul> element
  let profileListClass = 'profile-list';

  // Calculate the number of profiles per row
  let profilesPerRow = 4;
  let profilesRowCount = Math.ceil($filteredProviders.length / profilesPerRow);

  // Calculate the width percentage for each profile in a row
  let profileWidthPercentage = 100 / profilesPerRow;

  // Calculate the width percentage for the last row if it has fewer profiles
  let lastRowWidthPercentage = 100 / ($filteredProviders.length % profilesPerRow);
</script>

<!-- Search Bar -->
<div class="bg-gray-200 py-8">
  <div class="container mx-auto px-5">
    <form on:submit|preventDefault={searchProviders} class="flex flex-wrap ">
      <div class="flex items-center mr-4 mb-4 ">
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <DateInput bind:value={day} class="bg-gray-300 input input-bordered ml-2 " />
      </div>
      <div class="flex items-center mr-4 mb-4 ">
        <label for="start_time" class="block text-sm font-medium text-gray-700">Start Time</label>
        <select id="start_time" bind:value={start_time} required class="input input-bordered ml-2 bg-gray-300">
          {#each time as t}  
          <option value={t.id}>{t.t}</option>
          {/each}
        </select>
      </div>
      <div class="flex items-center mr-4 mb-4 ">
        <label for="end_time" class="block text-sm font-medium text-gray-700">End Time</label>
        <select id="end_time" bind:value={end_time} required class="bg-gray-300 input input-bordered ml-2">
          {#each time as t}
            <option value={t.id}>{t.t}</option>
          {/each}
        </select>
      </div>
      <div class="flex items-center mr-4 mb-4">
        <label for="address" class="block text-sm font-medium text-gray-700 qe ">Address</label>
        <input id="address" bind:value={userAddress} type="text" required class="input input-bordered ml-2 bg-gray-300" />
      </div>
      <div class="flex items-center mb-4">
        <button type="submit" class="w-full text-white bg-zinc-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Search Providers</button>
      </div>
    </form>
  </div>
</div>

<h1 class="text-center text-xl font-bold">Book Your Cleaning Services Now!</h1>

<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
  <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-4">
    <ul class="{profileListClass}">
      {#each $filteredProviders as provider, index}
        <li class="max-w-sm h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="/provider-profile/{provider.id}">
            <img class="rounded-t-lg" src="{provider.photo_url}" alt="profile photo" />
          </a>
          <div class="p-5">
            <a href="/provider-profile/{provider.id}">
              <span class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{provider.name}</span>
              <span class="mb-2 bg-green-100 text-green-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Verified</span>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">RM{provider.hourly_rate}/hour</p>
              <div class="justify-end flex items-center">
                <svg class="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <p class="ml-2 text-sm font-bold text-gray-900 dark:text-white">4.95</p>
                <span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                <p class="text-sm font-medium text-gray-900 underline dark:text-white">10+ reviews</p>
              </div>
            </a>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>



<style>
  .header {
    background-color: black;
  }

  /* form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  } */

  .profile-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the profile cards horizontally */
  gap: 5rem;
  list-style-type: none;
  padding: 0;
}

  .profile-card {
    border: 0px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 300px; /* Adjust the max-width */
    max-height: 100px;
    position: relative;
  }

  .profile-card-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .profile-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }

</style>
