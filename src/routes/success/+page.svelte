<script>
    import { onMount } from 'svelte';
    import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

onMount(async () => {
  const data = {
    address: 'Digital Mall, 2, Jalan 14/20, Seksyen 14 Petaling Jaya, 46100 Petaling Jaya, Selangor',
    service_fee: 150.0,
    booking_starttime: '15:00',
    booking_endtime: '18:00',
    booking_date: 'Sat Jul 15 2023 21:21:46 GMT+0800 (Malaysia Time)',
    user_id: 1,
    provider_id: 2
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