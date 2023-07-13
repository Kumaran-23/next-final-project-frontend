<script>
	import { onMount } from 'svelte';
	import { afterUpdate } from 'svelte';

	onMount(() => {
		setTimeout(() => {
			window.location.href = 'http://127.0.0.1:5173/'; // Replace with your homepage URL
		}, 5000);
	});

	afterUpdate(() => {
		setTimeout(() => {
			window.location.href = 'http://127.0.0.1:5173/'; // Replace with your homepage URL
		}, 5000);
	});
    
</script>

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
