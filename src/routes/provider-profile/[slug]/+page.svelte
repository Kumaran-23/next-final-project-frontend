<script>
    import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
  
    let provider = {};
    
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
  </script>
  
  <main class="p-4">
    {#if provider.name}
      <div class="flex items-center mb-4">
        <img src={provider.photo_url} alt="Provider Avatar" class="rounded-full h-16 w-16 mr-4">
        <div>
          <h1 class="text-xl font-semibold">{provider.name}</h1>
          <p class="text-gray-500">Hourly Rate: ${provider.hourly_rate}</p>
        </div>
        <div class="flex-grow"></div>
        <p class="text-right text-gray-500">Hourly Rate: ${provider.hourly_rate}</p>
      </div>
  
      <section>
        <h2 class="text-xl font-semibold mb-2">About Me</h2>
        <p>{provider.description}</p>
      </section>
  
      <!-- <section>
        <h2 class="text-xl font-semibold mb-2">Skills & Experience</h2>
        <p>{provider.skillsExperience}</p>
      </section> -->
    {:else}
      <p>Loading provider data...</p>
    {/if}
  </main>
  