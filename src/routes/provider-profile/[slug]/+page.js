import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { ResourceType } from 'maplibre-gl';

export async function load({ fetch, params }) {
  //  const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/providers/${params.slug}`);
  const rest = await fetch(PUBLIC_BACKEND_BASE_URL + `/provider-image/${params.slug}`)

  //  const res = await resp.json();
  const resty = await rest.json();
  if (rest.status == 200) {
    // console.log(`${res}`)
    return {
      // provider: res,
      provider_image: resty,
    }
  } else {
    return {
      // provider: [],
      provider_image: []
    }
  }
}

