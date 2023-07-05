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

  </script>

<style>
    .header {
      background-color: black;
    }
  </style>

<header class="header flex justify-between items-center py-4 px-6">
    <div class="logo text-white text-xl font-bold">Next Academy Project</div>
    <div class="flex space-x-4">
      {#if $isLoggedIn}
      <button class="text-white" on:click={() => handleLogout()}>SIGN OUT</button>
    {:else}
      <button class="text-white" on:click|preventDefault={() => goto('/provider/new')}>BECOME A PROVIDER</button>
      <button class="text-white" on:click|preventDefault={() => goto('/user-login')}>USER LOGIN</button>
      <button class="text-white" on:click|preventDefault={() => goto('/provider-login')}>Provider LOGIN</button>
    {/if}    
    </div>
  </header>
  
  