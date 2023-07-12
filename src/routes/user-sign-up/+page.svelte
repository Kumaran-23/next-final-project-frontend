<script>
    import { alertStore, showAlert } from '../../alertStore.js'
    import Alert from '../../Alert.svelte'
    import { writable } from 'svelte/store'
  

      let name = '';
      let email = '';
      let password = '';
  
      const { subscribe, set } = writable({text: '', type: ''});
      const alert = $alertStore;
  
      // const alert = writable({ text: '', type: '' });
    
      async function handleSubmit() {
        try {
          const response = await fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
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

<section class="bg-amber-400 dark:bg-blue-950">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div id="logo">
      <img class="w-100 h-20 mr-2" src="logo.jpg" alt="logo" />
          <p style="justify-content: center;">NeatFreak</p>    
    </div>
      <div class="w-full bg-white border border-slate-600 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an Account
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="name" name="name" id="name" bind:value={name} class="bg-slate-300 border border-slate-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ben" required="">
                  </div>

                  <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" name="email" id="email" bind:value={email} class="bg-slate-300 border border-slate-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required="">
                </div>

                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" bind:value={password} class="bg-slate-300 border border-slate-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
              </div>

                  
                  <button type="submit" on:click={handleSubmit} class="w-full text-white bg-zinc-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <a href="http://127.0.0.1:5173/user-login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>