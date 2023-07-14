<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { getTokenFromLocalStorage } from '../../../utils/auth';
  import { showAlert } from '../../../alertStore'

  let map;
  let searchInput;
  let locationSelected;
  let marker;
  let travelDistanceInput;

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
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + '/location/upsert', {
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

  onMount(() => {
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
    width: 90%;
    height: 300px;
  }
</style>

<div class="antialiased bg-gray-50 dark:bg-gray-900">
  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    aria-label="Sidenav"
    id="drawer-navigation"
  >
    <div class="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
      <ul class="space-y-2">
        <li>
          <a
            href="/provider/profile/1"
            class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
            </svg>
            <span class="ml-3">Profile</span>
          </a>
        </li>
        <li>
          <a
            href="/provider/availability"
            class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
            </svg>
            <span class="ml-3">Availability</span>
          </a>
        </li>
        <li>
          <a
            href="/provider/location"
            class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
            </svg>
            <span class="ml-3">Location</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>

  <main class="p-4 md:ml-64 h-auto">
    <div class="flex flex-col px-8 py-20 mx-auto md:h-screen">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-l xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Your Location
          </h1>

          <div class="flex justify-center items-center pt-4">
            <div id="map"></div>
          </div>

          <div class="flex justify-center items-center pt-4">
              <p>Where are you willing to travel for work?</p>
          </div>

          <div class="flex justify-center items-center pt-4">
            <div class="search-container">
              <input type="text" bind:this={searchInput} placeholder="Enter an address" />
              <input type="number" min="0" bind:this={travelDistanceInput} placeholder="Enter distance (km)" />
              <button class="btn bg-blue-500" on:click={searchAddress}>Search</button>
            </div>
          </div>
          {#if locationSelected}
          <button on:click={addressConfirmed} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full">Save Location</button>
          {/if}
        </div>
      </div>
    </div>
  </main>
</div>




