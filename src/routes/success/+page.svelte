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