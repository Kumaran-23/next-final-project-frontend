import { writable } from 'svelte/store';
// import { showAlert } from '../alertStore';
import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export const accessTokenStore = writable(false);

export async function userLogin(email, password) {
    try {
      const response = await fetch(PUBLIC_BACKEND_BASE_URL + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        // User logged in successfully
        // Retrieve the access token from the response header
        const accessToken = response.headers.get('Authorization');
  
        // Store the access token in the accessTokenStore
        accessTokenStore.set(accessToken);

        // Store the access token in local storage
        localStorage.setItem('accessToken', accessToken)

        // showAlert('Success', 'success')
  
        // Redirect to the dashboard or perform any necessary actions
        window.setTimeout(() => {
            window.location.href = '/';
          }, 3000);
      } else if (response.status === 401) {
        // showAlert('Invalid credentials')
      } else {
        const errorData = await response.json();
        // showAlert(`Error: ${errorData.error}`, 'failure');
      }

      return response;
    } catch (error) {
        // showAlert(`Error: ${error}`, 'failure')
        throw error;
    }
}

export function logout() {
    // Clear the access token from the store and local storage
    accessTokenStore.set(false);
    localStorage.removeItem('accessToken');

    // showAlert('Logged out successfully', 'success');
}


export async function providerLogin(email, password) {
  try {
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + '/providers/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // User logged in successfully
      // Retrieve the access token from the response header
      const accessToken = response.headers.get('Authorization');

      // Store the access token in the accessTokenStore
      accessTokenStore.set(accessToken);

      // Store the access token in local storage
      localStorage.setItem('accessToken', accessToken)

      // showAlert('Success', 'success')

      // Redirect to the dashboard or perform any necessary actions
      window.setTimeout(() => {
          window.location.href = '/';
        }, 3000);
    } else if (response.status === 401) {
      // showAlert('Invalid credentials')
    } else {
      const errorData = await response.json();
      // showAlert(`Error: ${errorData.error}`, 'failure');
    }

    return response;
  } catch (error) {
      // showAlert(`Error: ${error}`, 'failure')
      throw error;
  }
}


