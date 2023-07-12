<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { getTokenFromLocalStorage } from '../../../utils/auth';
  import { showAlert } from '../../../alertStore'

  import { writable } from 'svelte/store';

  let map;
  let searchInput;
  let locationSelected;
  let marker;
  let travelDistanceInput;

  const savedLocation = writable(null); // Store for the saved location data

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
      body: JSON.stringify({ address: locationName,
      travel_distance: travelDistanceInput.value }),
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

    const componentRestrictions = {
      country: 'MY' 
    };

    geocoder.geocode({ address, componentRestrictions }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;

        if (marker) {
        marker.setPosition(location);
      } else {
        marker = new google.maps.Marker({
          map,
          position: location,
        });
      }

      map.setCenter(location);
        locationSelected = location;
        console.log(JSON.stringify(locationSelected))
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }

  async function fetchSavedLocation() {
    try {
      const token = getTokenFromLocalStorage();
      const response = await fetch(PUBLIC_BACKEND_BASE_URL + '/location', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        savedLocation.set(data);
      } else {
        console.error(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch saved location:', error);
    }
  }

  onMount(() => {
    fetchSavedLocation();
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCoo4Tzwqzhb-ghGZjJx_R3iaaW0a7vx9s&callback=initMap`;
    script.defer = true;
    script.async = true;
     window.initMap = () => {
    const malaysiaBounds = {
      north: 7.5249,
      south: 1.1596,
      west: 99.6433,
      east: 104.2666
    };

    const ttdiLatLng = { lat: 3.1496, lng: 101.6255 };

    map = new google.maps.Map(document.getElementById('map'), {
      center: ttdiLatLng,
      zoom: 13,
      restriction: {
        latLngBounds: malaysiaBounds,
        strictBounds: false
      }
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
<div class="flex justify-center items-center pt-10">
    <p>Please Select Address and distance willing to travel for a job(in Km)</p>
</div>
<div class="flex justify-center items-center pt-5">
  <div class="search-container">
    <input type="text" bind:this={searchInput} placeholder="Enter an address" />
    <input type="number" min="0" bind:this={travelDistanceInput} placeholder="Enter distance" />
    <button class="btn bg-blue-500" on:click={searchAddress}>Search</button>
  </div>
</div>
<div class="flex justify-center items-center pt-10">
  {#if locationSelected}
    <button on:click={addressConfirmed}>Confirm Location</button>
  {/if}
</div>

<div class="flex justify-center items-center pt-10">
  {#if $savedLocation}
    <div>
      <h3>Saved Location:</h3>
      <p>{savedLocation.address}</p>
    </div>
  {/if}
</div>