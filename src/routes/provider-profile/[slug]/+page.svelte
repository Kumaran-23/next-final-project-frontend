<script>
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import { accessTokenStore, userLoginForm, logout } from '../../../utils/auth.js';
  import { showAlert } from '../../../alertStore.js';
  import { goto } from '$app/navigation';
  export let data;

  //header functions
  let showLoginOverlay = writable(false);


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


  console.log(data)
  
  // login/logout logic
  let isLoggedIn = writable(false);
  let unsubscribe;
  let email = '';
  let password = '';
  let showLoginPrompt = false; // Add this line
  
  async function handleLogin() {
    const response = await userLoginForm(email, password);
    if (response.ok) {
      isLoggedIn = true;
      showLoginOverlay.set(false);
      showLoginPrompt = false; // Add this line to hide the login prompt
    }
  }
  
  let buttonOffset = '{#if isLoggedIn}10{else}23{/if}';
  buttonOffset = buttonOffset.replace('{#if isLoggedIn}', isLoggedIn ? '10' : '23');

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
  
  // Variables for calculating provider fee and stripe payment url 
  let provider = {};
  let sessionUrl = "";
  let currency = 'RM';
  let unit_amount = 0;
  let hourlyRate = 0;
  let endHours = parseInt(localStorage.getItem('endTime').split(':')[0]);
  let startHours = parseInt(localStorage.getItem('startTime').split(':')[0]);
  let bookingHours = endHours - startHours;
  let bookingPrice = 0;
  let showBookingOverlay = false;
  
  // Example function to fetch provider data from the database
  async function fetchProviderData() {
    const { slug } = $page.params;
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + `/providers/${slug}`);
    if (response.ok) {
      provider = await response.json();
      localStorage.setItem('provider.Id', provider.id);
    }
  }

  onMount(fetchProviderData);

  // function handleBookProvider() {
  //   // Redirect the user to the checkout page
  //   goto('/checkout');
  // }

  function calculatePrice(endHours, startHours, hourlyRate) {
      return (endHours - startHours) * hourlyRate;
  }

  $: {
      unit_amount = calculatePrice(endHours, startHours, hourlyRate);
    }
    
    async function handlePayNow() {
  if ($isLoggedIn) {
    // Calculate booking hours and price
    bookingHours = endHours - startHours;
    bookingPrice = calculatePrice(endHours, startHours, provider.hourly_rate);
    localStorage.setItem('totalPrice', bookingPrice);
    // Show the booking overlay
    showBookingOverlay = true;
  } else {
     // Hide the login prompt
     showLoginPrompt = false;
    // Display the login prompt
    showLoginPrompt = true;
  }
}

  async function stripeCheckout() {
    try {
      await handlePayNow();
      const response = await fetch('http://localhost:8080/create-checkout-session', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
            },
          body: JSON.stringify({ unit_amount: bookingPrice * 100 })
        });

        if (response.ok) {
            const { sessionUrl: url } = await response.json();
            sessionUrl = url;
          } else {
            const errorData = await response.json();
            showAlert(`Error: ${errorData.error}`, 'failure');
          }
        } catch (error) {
          showAlert(`Error: ${error}`, 'failure');
        }
  }
                  
  async function goToPayment() {
    try {
      await handlePayNow();
      await stripeCheckout();
      window.location.href = sessionUrl; // Redirect the user to the Stripe payment page
      } catch (error) {
      console.error('Error during payment:', error);
      showAlert(`Error during payment: ${error}`, 'failure');
    }
  }
</script>

<header class="header flex justify-between items-center py-4 px-6">
  <div class="logo text-white text-xl font-bold">NeatFreak</div>
  <div class="flex space-x-4">
    {#if $isLoggedIn}
      <button class="text-white" on:click={() => handleLogout()}>SIGN OUT</button>
    {:else}
      <button class="text-white" on:click|preventDefault={() => goto('/sign-up')}>SIGN UP</button>
      <button class="text-white" on:click|preventDefault={() => goto('/login')}>LOGIN</button>
    {/if}
  </div>
</header>

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
    background-color: rgba(128, 128, 128, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .alert-form {
    background-color: white;
    padding: 2rem;
    border-radius: 4px;
    text-align: center;
  }

  .login-form {
    max-width: 400px;
    background-color: white;
    padding: 2rem;
    border-radius: 4px;
  }
  
  .booking-form {
    max-width: 400px;
    background-color: white;
    padding: 2rem;
    border-radius: 4px;
  }
  
  .header {
    background-color: black;
  }
    
</style>

<div class="antialiased bg-gray-50 dark:bg-gray-900">
  {#if provider.name}
    <main class="items-center h-auto px-4 py-20">
        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 p-8 lg:p-8">
            <div class="gap-8 items-center md:grid md:grid-cols-2">
                <div class="flex justify-center">
                    <img class="w-64 h-64 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="{provider.photo_url}" alt="profile photo" />
                </div>
                <div class="my-4">
                    <h2 class="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">{provider.name}</h2>
                    <p class="mb-4 text-xl font-extrabold leading-none text-gray-900 md:text-2xl dark:text-white">RM{provider.hourly_rate}/hr</p>
                    <dl>
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">About Me</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{provider.description}</dd>
                    </dl>
                    {#if isLoggedIn}
                      <button on:click={() => {handlePayNow(); showLoginOverlay.set(false);}} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Book Provider</button>
                    {:else}
                        <button on:click={() => showLoginOverlay = true} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login to Book</button>
                    {/if}
                </div>
            </div>
        </section>

        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 p-8 lg:p-8">  
          <h5 class="mb-4 font-semibold leading-none text-gray-900 dark:text-white">Work Photos</h5>
          <div class="grid gap-4">
            <div>
                <img class="h-auto max-w-full rounded-lg" src="https://chetscleaning.com/wp-content/uploads/ceramic-tile.jpg" alt="">
            </div>
            <div class="grid grid-cols-5 gap-4">
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://chetscleaning.com/wp-content/uploads/dressing-down-drapes.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://chetscleaning.com/wp-content/uploads/2.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://chetscleaning.com/wp-content/uploads/Before-and-after-pics-templates-15.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://chetscleaning.com/wp-content/uploads/2-1.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://chetscleaning.com/wp-content/uploads/Before-and-after-pics-templates-5.png" alt="">
                </div>
            </div>
          </div>
        </section>

        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 p-8 lg:p-8">  
          <h5 class="mb-4 font-semibold leading-none text-gray-900 dark:text-white">Reviews</h5>
          <!-- Rating -->
          <div class="flex items-center my-5">
            <p class="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">4.9</p>
            <p class="ml-2 font-medium text-gray-900 dark:text-white">Excellent</p>
            <span class="w-1 h-1 mx-2 bg-gray-900 rounded-full dark:bg-gray-500"></span>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">10+ reviews</p>
          </div>
          <div class="gap-8 sm:grid sm:grid-cols-2">
            <div>
                <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Clean</dt>
                    <dd class="flex items-center mb-3">
                        <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                            <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 88%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">4.8</span>
                    </dd>
                </dl>
                <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Fast response</dt>
                    <dd class="flex items-center mb-3">
                        <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                            <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 89%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">4.9</span>
                    </dd>
                </dl>
            </div>
            <div>
                <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Value for money</dt>
                    <dd class="flex items-center mb-3">
                        <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                            <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 89%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">4.9</span>
                    </dd>
                </dl>
                <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Friendly</dt>
                    <dd class="flex items-center mb-3">
                        <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                            <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 70%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">4.0</span>
                    </dd>
                </dl>
            </div>
          </div>
          <!-- Review -->
        </section>
    </main>
  {:else}
    <p>Loading provider data...</p>
  {/if}

  <!-- {#if showLoginOverlay}
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
  {/if} -->

  {#if showBookingOverlay}
    <div class="overlay">
      <div class="booking-form">
        <h2 class="text-xl font-semibold mb-4">Booking Details</h2>
        <p>Hours Booked: {bookingHours}</p>
        <p>Hourly Rate: RM {provider.hourly_rate}</p>
        <p>Total Price: RM {bookingPrice}</p>
        <button class="btn btn-primary" on:click={goToPayment}>Proceed to Payment</button>
        <button class="btn btn-primary" on:click={() => showBookingOverlay = false}>Cancel</button>
      </div>
    </div>
  {/if}


  {#if !$isLoggedIn && !showBookingOverlay && showLoginPrompt}
  <div class="overlay">
    <div class="alert-form">
      <p>Please log in to book the provider.</p>
      <button class="btn btn-primary" on:click={() => { showLoginOverlay = true; showLoginPrompt = false;}}>Login</button>
    </div>
  </div>
{/if}


  <!-- {#each data.provider_image as image}
    <div class="card hover:transition delay-150 hover:-translate-y-10 shadow-xl shadow-sky-200 hover:shadow-indigo-600 flex flex-col justify-between">
      <figure style="height: 100px; width: 100px;" class="relative">
        <img src={image.image_url} alt="" class="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110" />
      </figure>
    </div>
  {/each} -->
  </div>
