import { writable } from 'svelte/store';
import { showAlert } from '../alertStore';
import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export const accessTokenStore = writable(false);

export function getTokenFromLocalStorage() {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        return(accessToken);
    }
    return null;
}

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
        // Retrieve the access token from the response body
        const data = await response.json();
        const accessToken = data.accessToken
      const userId = data.userId

      // Store the access token in the accessTokenStore
      accessTokenStore.set(accessToken);

      // Store the access token in local storage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('userId', userId)

        showAlert('Success', 'success')
  
        // Redirect to the dashboard or perform any necessary actions
        window.setTimeout(() => {
            window.location.href = '/';
          }, 3000);
      } else if (response.status === 401) {
        showAlert('Invalid credentials')
      } else {
        const errorData = await response.json();
        showAlert(`Error: ${errorData.error}`, 'failure');
      }

      return response;
    } catch (error) {
        showAlert(`Error: ${error}`, 'failure')
        throw error;
    }
}

export function logout() {
    // Clear the access token from the store and local storage
    accessTokenStore.set(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('providerId');
    localStorage.removeItem('userId');

    showAlert('Logged out successfully', 'success');
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
      // Retrieve the access token from the response body
      const data = await response.json();
      const accessToken = data.accessToken
      const providerId = data.providerId

      // Store the access token in the accessTokenStore
      accessTokenStore.set(accessToken);

      // Store the access token in local storage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('providerId', providerId)

      showAlert('Success', 'success')

      // Redirect to the dashboard or perform any necessary actions
      window.setTimeout(() => {
          window.location.href = '/';
        }, 3000);
    } else if (response.status === 401) {
      showAlert('Invalid credentials')
    } else {
      const errorData = await response.json();
      showAlert(`Error: ${errorData.error}`, 'failure');
    }

    return response;
  } catch (error) {
      showAlert(`Error: ${error}`, 'failure')
      throw error;
  }
}