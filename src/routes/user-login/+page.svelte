<script>
    import { alertStore, showAlert } from '../../alertStore.js'
    import Alert from '../../Alert.svelte';
    import { writable } from 'svelte/store';
    import { userLogin } from '../../utils/auth.js'
  
    let email = '';
    let password = '';
  
    const { subscribe, set } = writable({text: '', type: ''});
    const alert = $alertStore;
  
    async function handleSubmit() {
      const response = await userLogin(email, password);
  }
  
  </script>
  
  <div class="max-w-sm mx-auto">
  
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
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md" on:click={handleSubmit}>Sign In</button>
      </div>
    </form>
    {#if $alertStore.text}
        <Alert bind:text={$alertStore.text} bind:type={$alertStore.type} />
    {/if}
    
  </div>
    