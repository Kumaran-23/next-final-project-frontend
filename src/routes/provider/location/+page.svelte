<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { getTokenFromLocalStorage, accessTokenStore } from '../../../utils/auth';

  let map;
  let searchInput;
  let locationSelected;

  async function addressConfirmed() {
    if (!locationSelected) {
      console.error('No location selected');
      return;
    }

    const lat = locationSelected.lat();
    const lng = locationSelected.lng();

    // Perform reverse geocoding to get the location name from coordinates
    const geocodingResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCoo4Tzwqzhb-ghGZjJx_R3iaaW0a7vx9s`);

    if (geocodingResponse.status !== 200) {
      console.error('Failed to perform reverse geocoding');
      console.error(geocodingResponse.status);
      return;
    }

    const geocodingData = await geocodingResponse.json();

    if (geocodingData.status !== 'OK') {
      console.error('Reverse geocoding failed');
      return;
    }

    const locationName = geocodingData.results[0].formatted_address;

    const token = getTokenFromLocalStorage();
    console.log(typeof token)
    console.log(token)
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + '/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ address: locationName }),
    });

    if (response.status === 200) {
      goto('/');
    } else {
      console.error(await response.json());
    }
  }

  function searchAddress() {
    const geocoder = new google.maps.Geocoder();
    const address = searchInput.value;

    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        new google.maps.Marker({
          map,
          position: location,
        });

        locationSelected = location;
        console.log(JSON.stringify(locationSelected))
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }

  onMount(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCoo4Tzwqzhb-ghGZjJx_R3iaaW0a7vx9s&callback=initMap`;
    script.defer = true;
    script.async = true;
    window.initMap = () => {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
      });
    };

    document.head.appendChild(script);
  });
</script>

<style>
  #map-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #map {
    width: 50%;
    height: 200px;
  }

 .search-container input {
    margin-right: 8px;
  }
</style>

<div class="flex justify-center items-center pt-20">
  <div id="map"></div>
</div>
<div class="flex justify-center items-center pt-5">
  <div class="search-container">
    <input type="text" bind:this={searchInput} placeholder="Enter an address" />
    <button class="btn bg-blue-500" on:click={searchAddress}>Search</button>
  </div>
</div>
<div class="flex justify-center items-center pt-20">
    <p>Please Select Address</p>
</div>
<div class="flex justify-center items-center pt-10">
  {#if locationSelected}
    <button on:click={addressConfirmed}>Confirm Location</button>
  {/if}
</div>






