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

<p>SUCESS!!</p>

<main class="flex flex-col items-center justify-center h-screen bg-amber-100">
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
</style>
