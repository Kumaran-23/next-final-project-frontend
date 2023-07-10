<script>
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { accessTokenStore, userLoginForm } from '../../../utils/auth.js';
	import { onDestroy } from 'svelte';

  let provider = {};
  let isLoggedIn = false;
  let showLoginOverlay = false;

  let email = '';
  let password = '';

  // Example function to fetch provider data from the database
  async function fetchProviderData() {
    const { slug } = $page.params;
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + `/providers/${slug}`);
    if (response.ok) {
      provider = await response.json();
      provider.avatar = provider.photo_url;
    }
  }

  onMount(fetchProviderData);

  onDestroy(() => {
    // Cleanup is automatically handled by Svelte
  });

  const unsubscribe = accessTokenStore.subscribe((accessToken) => {
    isLoggedIn = !!accessToken;
  });

  onDestroy(() => {
    unsubscribe();
  });

  async function handleLogin() {
    const response = await userLoginForm(email, password);
    if (response.ok) {
      isLoggedIn = true;
      showLoginOverlay = false;
    }
  }

  let buttonOffset = '{#if isLoggedIn}10{else}23{/if}';
  buttonOffset = buttonOffset.replace('{#if isLoggedIn}', isLoggedIn ? '10' : '23');
</script>

<style>
  .custom-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .login-form {
    max-width: 400px;
    background-color: white;
    padding: 2rem;
    border-radius: 4px;
  }
</style>

<main class="p-4">
  {#if provider.name}
    <div class="custom-container" style="left: calc(50% - (6rem + 0.5rem * {buttonOffset}))">
      <!-- Photo -->
      <div class="relative w-32 h-32">
        <div class="rounded-full overflow-hidden">
          <img src={provider.avatar} alt="Provider Avatar" class="object-cover w-full h-full">
        </div>
      </div>

      <!-- Provider Name -->
      <div class="text-center mt-4">
        <h1 class="text-3xl font-semibold">{provider.name}</h1>
      </div>

      <!-- Hourly Rate -->
      {#if isLoggedIn}
        <div class="text-center mt-2">
          <p>Hourly Rate: ${provider.hourly_rate}</p>
        </div>
      {/if}

      <!-- About Me -->
      <div class="text-center mt-4">
        <h2 class="text-xl font-semibold mb-2">About Me</h2>
        <p>{provider.description}</p>
      </div>

      <!-- Book Provider (If User Logged In) -->
      {#if isLoggedIn}
        <div class="text-center mt-4">
          <button class="btn btn-primary">Book Provider</button>
        </div>
      {:else}
        <div class="text-center mt-4">
          <button class="btn btn-primary" on:click={() => showLoginOverlay = true}>Please log in to book this provider</button>
        </div>
      {/if}
    </div>
  {:else}
    <p>Loading provider data...</p>
  {/if}

  {#if showLoginOverlay}
    <div class="overlay">
      <div class="login-form">
        <h2 class="text-xl font-semibold mb-4">User Login</h2>
        <form>
          <div class="mb-4">
            <label class="block mb-2" for="email">Email</label>
            <input class="w-full border border-gray-300 px-4 py-2 rounded-md" type="email" id="email" bind:value={email}>
          </div>
          
          <div class="mb-4">
            <label class="block mb-2" for="password">Password</label>
            <input class="w-full border border-gray-300 px-4 py-2 rounded-md" type="password" id="password" bind:value={password}>
          </div>
          
          <div class="text-center mb-4">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md" on:click={handleLogin}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</main>
