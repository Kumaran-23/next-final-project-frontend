<script>
    import { alertStore, showAlert } from '../../alertStore.js'
    import Alert from '../../Alert.svelte';
    import { writable } from 'svelte/store';
  
      let firstName = '';
      let lastName = ''
      let email = '';
      let password = '';
  
      const { subscribe, set } = writable({text: '', type: ''});
      const alert = $alertStore;
  
      // const alert = writable({ text: '', type: '' });
    
      async function handleSubmit() {
        try {
          const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password })
          });
  
          if (response.ok) {
            showAlert('User created successfully', 'success');
            setTimeout(() => {
              window.location.href = '/';}, 5000); // Delay of 2000 milliseconds (2 seconds)
  
          } else {
            const errorData = await response.json();
            showAlert(`Error: ${errorData.error}`, 'failure');
          }
        } catch (error) {
          showAlert(`Error: ${error}`, 'failure');
        }
      };
  
</script>
    
    <form class="max-w-sm mx-auto">
      <div class="mb-4">
          <label class="block mb-2" for="firstName">First Name</label>
          <input class="w-full border border-gray-300 px-4 py-2 rounded-md" type="firstName" id="firstName" bind:value={firstName}>
        </div>
  
        <div class="mb-4">
          <label class="block mb-2" for="lastName">Last Name</label>
          <input class="w-full border border-gray-300 px-4 py-2 rounded-md" type="lastName" id="lastName" bind:value={lastName}>
        </div>
  
  
      <div class="mb-4">
        <label class="block mb-2" for="email">Email</label>
        <input class="w-full border border-gray-300 px-4 py-2 rounded-md" type="email" id="email" bind:value={email}>
      </div>
    
      <div class="mb-4">
        <label class="block mb-2" for="password">Password</label>
        <input class="w-full border border-gray-300 px-4 py-2 rounded-md" type="password" id="password" bind:value={password}>
      </div>
    
      <div class="text-center mb-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md" on:click={handleSubmit}>Sign Up</button>
      </div>
      {#if $alertStore.text}
        <Alert bind:text={$alertStore.text} bind:type={$alertStore.type} />
      {/if}
  
  
    </form>
    