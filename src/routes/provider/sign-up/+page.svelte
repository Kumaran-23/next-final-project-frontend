<svelte:head>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>

<script>
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { goto } from '$app/navigation';
  import { providerLogin } from '../../../utils/auth.js';
  import { uploadMedia } from '../../../utils/s3-uploader.js';
  let formErrors = {};
  let clicked = false;

  function postSignUp() {
    goto('/');
  };

  async function createProvider(evt) {
    evt.preventDefault();
    clicked = true;
    const [fileName, fileUrl] = await uploadMedia(evt.target['file'].files[0]);

    if (evt.target['password'].value != evt.target['password-confirmation'].value) {
      formErrors['password'] = { message: 'Password confirmation does not match' };
      clicked = false;
      console.log(clicked);
      return;
    };

    const providerData = {
      name: evt.target['name'].value,
      email: evt.target['email'].value,
      password: evt.target['password'].value,
      hourly_rate: parseInt(evt.target['hourly_rate'].value),
      photo_url: fileUrl
    };

    const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/provider/sign-up', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(providerData)
    });

    const responseData = await resp.json();
    console.log(responseData);

    if (resp.status == 200) {
      const res = await providerLogin(providerData.email, providerData.password);

      if (res.success) {
        postSignUp();
      }
    } else {
      clicked = false;
      formErrors = responseData.error;
      console.log(formErrors);
    };
  };
</script>

<div class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
      <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
      NeatFreak
    </a>
    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign up as a provider
        </h1>
        <form class="space-y-4 md:space-y-6" on:submit={createProvider}>
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input type="text" name="name" id="name" placeholder="John Doe" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            {#if 'name' in formErrors}
            <label class="label" for="name">
                <span class="label-text-alt mb-2 text-sm font-medium text-red-400">{formErrors['name']}</span>
            </label>
            {/if}
          </div>
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" name="email" id="email" placeholder="john@example.com" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            {#if 'email' in formErrors}
            <label class="label" for="email">
                <span class="label-text-alt mb-2 text-sm font-medium text-red-400">{formErrors['email']}</span>
            </label>
            {/if}
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            {#if 'password' in formErrors}
            <label for="password" class="label">
              <span class="label-text-alt mb-2 text-sm font-medium text-red-400">{formErrors['password']}</span>
            </label>
            {/if}
          </div>
          <div>
            <label for="password-confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
            <input type="password" name="password-confirmation" id="password-confirmation" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            {#if 'password' in formErrors}
            <label for="password" class="label">
              <span class="label-text-alt mb-2 text-sm font-medium text-red-400">{formErrors['password']}</span>
            </label>
            {/if}
          </div>
          <div>
            <label for="hourly_rate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hourly Rate</label>
            <input type="number" name="hourly_rate" id="hourly_rate" placeholder="15" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            {#if 'hourly_rate' in formErrors}
            <label class="label" for="hourly_rate">
                <span class="label-text-alt mb-2 text-sm font-medium text-red-400">{formErrors['hourly_rate']}</span>
            </label>
            {/if}
          </div>
          <div>      
            <label for="file" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Photo</label>
            <input type="file" name="file" id="file" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
            {#if 'file' in formErrors}
            <label class="label" for="file">
                <span class="label-text-alt mb-2 text-sm font-medium text-red-400">{formErrors['file']}</span>
            </label>
            {/if}
          </div>

          <div class="form-control w-full">
            {#if clicked}
            <button disabled type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center justify-center w-full">
              <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              Loading...
            </button>
            {:else}
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full">Sign Up</button>
            {/if}
          </div>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account? <a href="/provider/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</div>