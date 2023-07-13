<script>
    import { accessTokenStore, logout } from '../utils/auth.js';
	  import { onDestroy, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
  

    let isLoggedIn = writable(false);
    let unsubscribe;

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
  // temporary dummy setup to save day, starttime and endtime to local storage
  let selectedDay;
  let selectedStartTime;
  let selectedEndTime;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = [
    { label: '09:00 AM', value: '09:00:00' },
    { label: '10:00 AM', value: '10:00:00' },
    { label: '11:00 AM', value: '11:00:00' },
    // Add more time options as needed
  ];
  
  function handleSubmit() {
    // Handle the form submission, e.g., store the selected values or perform other actions
    console.log('Selected Day:', selectedDay);
    console.log('Selected Start Time:', selectedStartTime);
    console.log('Selected End Time:', selectedEndTime);
  
  // Storing the search criteria in local storage
  localStorage.setItem('searchDay', selectedDay);
  localStorage.setItem('startTime', selectedStartTime);
  localStorage.setItem('endTime', selectedEndTime);
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
  
<main>
  <h1>Select Day and Time</h1>
  <form on:submit|preventDefault="{handleSubmit}">
    <label>
      Select Day:
      <select bind:value="{selectedDay}">
        {#each daysOfWeek as day}
        <option value="{day}">{day}</option>
        {/each}
      </select>
    </label>

    <label>
      Select Start Time:
      <select bind:value="{selectedStartTime}">
        {#each times as time}
          <option value="{time.value}">{time.label}</option>
        {/each}
      </select>
    </label>

    <label>
      Select End Time:
      <select bind:value="{selectedEndTime}">
        {#each times as time}
        <option value="{time.value}">{time.label}</option>
        {/each}
      </select>
    </label>
    
    <button type="submit">Submit</button>
  </form>
</main>

<style>
  .header {
      background-color: black;
    }

   /* for dummy form */
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
      }
    </style>

