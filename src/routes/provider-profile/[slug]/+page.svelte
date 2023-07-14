<script>
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import { accessTokenStore, userLoginForm } from '../../../utils/auth.js';
  import { showAlert } from '../../../alertStore.js';
  export let data;

  console.log(data)
  
  // login/logout logic
  let isLoggedIn = writable(false);
  let unsubscribe;
  let email = '';
  let password = '';
  
  async function handleLogin() {
    const response = await userLoginForm(email, password);
    if (response.ok) {
      isLoggedIn = true;
      showLoginOverlay = false;
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
  let showLoginOverlay = false;
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
    // Calculate booking hours and price
      bookingHours = endHours - startHours;
      bookingPrice = calculatePrice(endHours, startHours, provider.hourly_rate);
      localStorage.setItem('totalPrice', bookingPrice);
    // Show the booking overlay
      showBookingOverlay = true;
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
    background-color: rgba(128, 128, 128, 0.5); /* Light gray background color */
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
  
  .booking-form {
    max-width: 400px;
    background-color: white;
    padding: 2rem;
    border-radius: 4px;
  }
</style>

<div class="antialiased bg-gray-50 dark:bg-gray-900">
  {#if provider.name}
    <main class="items-center h-auto px-4 py-20">
        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 px-4 lg:px-8">
            <!-- First Row -->
            <!-- <div class="flex justify-between items-center pt-4">
                <h5 class="font-semibold dark:text-white">Info</h5>
                {#if providerId}
                <button on:click={() => editModalOpen = true} class="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="button">
                    Edit
                </button>
                {/if}
            </div> -->
            <!-- Line -->
            <!-- <hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700"> -->
            <!-- Second Row -->
            <div class="gap-8 items-center p-4 md:grid md:grid-cols-2">
                <div class="flex justify-center">
                    <img class="w-64 h-64 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="{provider.photo_url}" alt="profile photo" />
                </div>
                <div class="mt-4">
                    <h2 class="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">{provider.name}</h2>
                    <p class="mb-4 text-xl font-extrabold leading-none text-gray-900 md:text-2xl dark:text-white">${provider.hourly_rate}/hr</p>
                    <dl>
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">About Me</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{provider.description}</dd>
                    </dl>
                </div>
            </div>
        </section>
        
        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 px-4 lg:px-8">
          <!-- First Row -->
          <div class="flex justify-between items-center pt-4">
              <h5 class="font-semibold dark:text-white">Availability</h5>
              <button id="updateProductButton" data-modal-toggle="updateProductModal" class="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="button">
                  Update product
              </button>
          </div>
          <!-- Line -->
          <hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700">
          <!-- Second Row -->

            <div class="flex items-center mb-5">
              <p class="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">8.7</p>
              <p class="ml-2 font-medium text-gray-900 dark:text-white">Excellent</p>
              <span class="w-1 h-1 mx-2 bg-gray-900 rounded-full dark:bg-gray-500"></span>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">376 reviews</p>
              <a href="#" class="ml-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Read all reviews</a>
            </div>
            <div class="gap-8 sm:grid sm:grid-cols-2">
              <div>
                  <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</dt>
                      <dd class="flex items-center mb-3">
                          <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                              <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 88%"></div>
                          </div>
                          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
                      </dd>
                  </dl>
                  <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Comfort</dt>
                      <dd class="flex items-center mb-3">
                          <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                              <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 89%"></div>
                          </div>
                          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                      </dd>
                  </dl>
                  <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Free WiFi</dt>
                      <dd class="flex items-center mb-3">
                          <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                              <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 88%"></div>
                          </div>
                          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
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
                          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                      </dd>
                  </dl>
                  <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Cleanliness</dt>
                      <dd class="flex items-center mb-3">
                          <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                              <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 70%"></div>
                          </div>
                          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">7.0</span>
                      </dd>
                  </dl>
                  <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                      <dd class="flex items-center">
                          <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                              <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style="width: 89%"></div>
                          </div>
                          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                      </dd>
                  </dl>
              </div>
            </div>

            <article>
              <div class="flex items-center mb-4 space-x-4">
                  <img class="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-5.jpg" alt="">
                  <div class="space-y-1 font-medium dark:text-white">
                      <p>Jese Leos</p>
                  </div>
              </div>
              <div class="flex items-center mb-1">
                  <svg class="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                  <svg class="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                  <svg class="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                  <svg class="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                  <svg class="w-4 h-4 text-gray-300 dark:text-gray-500 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                  <h3 class="ml-2 text-sm font-semibold text-gray-900 dark:text-white">Thinking to buy another one!</h3>
              </div>
              <footer class="mb-5 text-sm text-gray-500 dark:text-gray-400"><p>Reviewed in the United Kingdom on <time datetime="2017-03-03 19:00">March 3, 2017</time></p></footer>
              <p class="mb-2 text-gray-500 dark:text-gray-400">This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.</p>
            </article>


        </section>

        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 px-4 lg:px-8">
          <!-- First Row -->
          <div class="flex justify-between items-center pt-4">
              <h5 class="font-semibold dark:text-white">Availability</h5>
              <button id="updateProductButton" data-modal-toggle="updateProductModal" class="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="button">
                  Update product
              </button>
          </div>
          <!-- Line -->
          <hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700">
          <!-- Second Row -->
          <div class="grid gap-4">
            <div>
                <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg" alt="">
            </div>
            <div class="grid grid-cols-5 gap-4">
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" alt="">
                </div>
                <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" alt="">
                </div>
            </div>
        </div>
        </section>

        <!-- Book Provider (If User Logged In) -->
        {#if isLoggedIn}
          <div class="text-center mt-4">
            <button class="btn btn-primary" on:click={handlePayNow}>Book Provider</button>
          </div>
        {:else}
          <div class="text-center mt-4">
            <button class="btn btn-primary" on:click={() => showLoginOverlay = true}>Please log in to book this provider</button>
          </div>
        {/if}
    </main>
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

  {#each data.provider_image as image}
    <div class="card hover:transition delay-150 hover:-translate-y-10 shadow-xl shadow-sky-200 hover:shadow-indigo-600 flex flex-col justify-between">
      <figure style="height: 100px; width: 100px;" class="relative">
        <img src={image.image_url} alt="" class="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110" />
      </figure>
    </div>
  {/each}

  {#if showBookingOverlay}
    <div class="overlay">
    <div class="booking-form">
      <h2 class="text-xl font-semibold mb-4">Booking Details</h2>
      <p>Hours Booked: {bookingHours}</p>
      <p>Hourly Rate: RM {provider.hourly_rate}</p>
      <p>Total Price: RM {bookingPrice}</p>
      <button class="btn btn-primary" on:click={goToPayment}>Proceed to Payment</button>
      <button class="btn btn-primary">Cancel</button>
    </div>
    </div>
    {/if}

</div>