<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { time } from "../../utils/time.js"
  import { DateInput } from 'date-picker-svelte';

  let providers = writable([]);
  let day = new Date();
  let start_time = '';
  let end_time = '';
  let userAddress = '';

  async function searchProviders() {

    console.log('Day:', day);
    console.log('Start Time:', start_time);
    console.log('End Time:', end_time);
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
      $providers = data;
    } else {
      console.error('Search failed');
    }

  localStorage.setItem('searchDay', day);
  localStorage.setItem('startTime', start_time);
  localStorage.setItem('endTime', end_time);
  }

  function isDuplicateProvider(providerId) {
    const displayedProviders = [];
    return displayedProviders.includes(providerId);
  }
</script>

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
  </form>
</div>


<div class="container mx-auto py-10 px-5">
  <ul>
    {#each $providers as provider}
      {#if !isDuplicateProvider(provider.id)}
        <li class="flex flex-wrap gap-5">
          <h2>{provider.name}</h2>
          <p>{provider.description}</p>
          <p>{provider.hourly_rate}</p>
          <p>
            <img src={provider.photo_url} alt="" class="w-[100px] h-[100px]" />
          </p>
        </li>
      {/if}
    {/each}
  </ul>
</div>
