<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

    let provider = null;
    let sessionUrl = '';

    async function fetchProviderData() {
        const { slug } = $page.params;
        const response = await fetch(PUBLIC_BACKEND_BASE_URL + `/providers/${slug}`);
        if (response.ok) {
            provider = await response.json();
        }
    }
    onMount(fetchProviderData);

    let currency = 'myr';
    let name = 'cleaning';
    let unit_amount = 0;
    let quantity = 1;
    let hourlyRate = 0;
    let endHours = localStorage.getItem("endTime");
    let startHours = localStorage.getItem("startTime");

    function calculatePrice(endHours, startHours, hourlyRate) {
        return (endHours - startHours) * hourlyRate;
    }

    $: {
        unit_amount = calculatePrice(endHours, startHours, hourlyRate);
    }

    async function stripeCheckout() {
        try {
            const response = await fetch('http://localhost:8080/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currency, name, unit_amount, quantity })
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

    async function handlePayNow() {
        await stripeCheckout();
        window.location.href = sessionUrl;
    }
</script>

<main>
    <div class="stripe-checkout-container">
        <div class="payment-summary">
            <h1>Checkout Page</h1>
            <p>Total Price: ${unit_amount}</p>
        </div>
        <div class="payment-form">
            <h2>Payment Information</h2>
            <form>
                <!-- Form inputs here -->
                <button id="pay-now-button" on:click={handlePayNow}>Pay Now</button>
            </form>
        </div>
    </div>
</main>

<style>
    /* Styles here */
</style>
