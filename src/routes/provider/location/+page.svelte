<script>
  import { onMount, onDestroy } from 'svelte'
  import maplibregl, { Map, NavigationControl, Marker } from 'maplibre-gl';
  import GeocodingControl from "@maptiler/geocoding-control/GeocodingControl.svelte";   
  import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl";
  import 'maplibre-gl/dist/maplibre-gl.css';

  let map;
  let mapContainer;
  let mapController;

  const apiKey = '3VlEHNwFVJ6ryQPMVrcT';

  onMount(() => {
    const initialState = { lng: 101.625278, lat: 3.150556, zoom: 14 };

    map = new Map({
      container: mapContainer,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
    map.addControl(new NavigationControl(), 'top-right');
    new Marker({color: "#FF0000"}).setLngLat([101.625278,3.150556]).addTo(map);
    mapController = createMapLibreGlMapController(map, maplibregl);
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="map-wrap">
  <a href="https://www.maptiler.com" class="watermark"><img
    src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
  <div class="map" bind:this={mapContainer}></div>
  {#if mapController}
    <div class="geocoding">
      <GeocodingControl {mapController} {apiKey} {maplibregl} />
    </div>
  {/if}
</div>

<style>
  .map-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh); /* calculate height of the screen minus the heading */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .map {
    position: absolute;
    width: 50%;
    height: 50%;
  }

  .watermark {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 999;
  }
</style>