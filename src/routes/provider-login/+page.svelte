<script>
  import { alertStore, showAlert } from '../../alertStore.js'
  import Alert from '../../Alert.svelte'
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { getTokenFromLocalStorage, providerLogin } from '../../utils/auth.js'

  let email = '';
  let password = '';

  const { subscribe, set } = writable({text: '', type: ''});
  const alert = $alertStore;

  async function handleSubmit() {
    const response = await providerLogin(email, password);

    if (response.status === 200) {
      showAlert('Login successful!', 'success');
      goto('/provider/availability')
    } else {
      showAlert('Incorrect email or password', 'failure')
    }
  }
</script>

<section font="serif" class="bg-sky-200 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

    <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
      <img class="w-8 h-8 mr-2" src="logo.jpg" alt="logo">
      NeatFreak
    </a>

    <div class="w-full bg-white border border-slate-600 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Login as a provider
        </h1>

        <form class="space-y-4 md:space-y-6" action="#">
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" name="email" id="email" bind:value={email} class="bg-slate-300 border border-slate-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@example.com" required="">
            </div>

            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" bind:value={password} class="bg-slate-300 border border-slate-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-start">
                    
                </div>
                </div>

            <button type="submit" on:click={handleSubmit} class="w-full  text-white bg-zinc-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</button>
            
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <a href="/provider/sign-up" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
            </p>
        </form>

        {#if $alertStore.text}
        <Alert bind:text={$alertStore.text} bind:type={$alertStore.type} />
        {/if}
      </div>
    </div>
  </div>
</section>