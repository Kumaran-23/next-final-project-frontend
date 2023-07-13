import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getProviderIdFromLocalStorage } from '../../../utils/auth.js';

export async function load({ fetch, session }) {
    const providerId = getProviderIdFromLocalStorage();
    const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/availability/${providerId}`);
  
    const res = await resp.json();

    if (resp.status == 200) {
      console.log(res)
      return {
        availability: res
      }
    } else {
      return {
        availability: []
      }
    }
};