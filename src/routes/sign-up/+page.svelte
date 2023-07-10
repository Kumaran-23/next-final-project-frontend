<script>
    //import { navigate } from 'svelte-routing';
  
    function handleProviderSignUp() {
        window.location.href = '/provider-sign-up';
    }
  
    function handleUserSignUp() {
        window.location.href = '/user-sign-up';
    }
  </script>
  
  <div class="h-screen flex justify-center items-start pt-20">
    <div class="bg-gray-100 p-6 rounded-lg" style="margin-top: 1vh;">
      <h2 class="text-2xl font-bold mb-4 text-center">Final Project</h2>
      <div class="button-container flex flex-col items-center">
        <button class="button button-sm" on:click={handleProviderSignUp}>Become a Provider</button>
        <button class="button button-sm" on:click={handleUserSignUp}>Create a User Account</button>
      </div>
      <div class="footer flex justify-center items-center mt-4">
        <p class="text-sm text-gray-500 text-center">By signing up you agree to our Terms of Use and Privacy Policy.</p>
      </div>
    </div>
  </div>
  
  <style>
    .button {
      width: 175px;
      padding: 0.5rem;
      margin-bottom: 0.75rem;
      background-color: #007aff;
      color: white;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
  
    .button:hover {
      background-color: #0056b3;
    }
  
    .button-sm {
      font-size: 14px;
      white-space: nowrap; /* Ensure button text stays on one line */
    }
  
    .footer {
      font-size: 12px;
      color: gray;
      margin-top: 1rem;
    }
  </style>
  