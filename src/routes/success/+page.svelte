<script>
    import { onMount } from 'svelte';
    import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

onMount(async () => {
  const data = {
    address: localStorage.getItem('userAddress'),
    service_fee: parseInt(localStorage.getItem('totalPrice')),
    booking_starttime: localStorage.getItem('startTime') + ':00',
    booking_endtime: localStorage.getItem('endTime') + ':00',
    booking_date: localStorage.getItem('searchDay'),
    user_id: parseInt(localStorage.getItem('userId')),
    provider_id: parseInt(localStorage.getItem('provider.Id'))
  };

  const response = await fetch(PUBLIC_BACKEND_BASE_URL +'/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  console.log(responseData);
});

</script>

<!-- <main class="flex flex-col items-center justify-center h-screen bg-amber-100">
	<div id="logo">
		<img class="w-100 h-20 mr-2" src="logo.jpg" alt="logo" />
		<p style="justify-content: center;">NeatFreak</p>
	</div>
    <br>

	<div class="bg-sky-200 font-serif">
		<header class="text-xl text-center border bg-amber-400 font-bold mb-4">
			Your Booking is Confirmed
		</header>

		<section class="text-lg text-center max-w-xl">
			<div>
				<p class="text-black">Thank you for booking our cleaning services.</p>
			</div>
            
			<p class="text-black">We look forward to serving you on the scheduled date.</p>
			<p class="text-black">
				If you have any questions or need to make any changes to your booking, please contact our
				support team.
			</p>
            <br>
			<div />
		</section>
	</div>
</main>

<style>
	body {
		font-family: Arial, sans-serif;
	}

	main {
		padding: 2rem;
	}

	header {
		color: #333;
	}

	section {
		color: #666;
	}
</style> -->

<section class="bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Your booking is confirmed!</h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Thank you for booking our cleaning services. If you have any questions or need to make any changes to your booking, please contact our
				support team.</p>
            <a href="#" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Get started
                <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="https://media.istockphoto.com/id/518586238/photo/commercial-cleaning-contractors.jpg?s=612x612&w=0&k=20&c=7MJ8TJRs_EotZw3rPNicWBkgLjECiigOg7_nOkTyylU=" alt="mockup">
        </div>                
    </div>
</section>