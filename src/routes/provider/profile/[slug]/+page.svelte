<script>
    export let data;
    import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
    import { goto } from '$app/navigation';
    import { getProviderIdFromLocalStorage, getTokenFromLocalStorage } from '../../../../utils/auth.js';

    let clicked = false;
    let editModalOpen = false;

    const providerId = getProviderIdFromLocalStorage();
    const accessToken = getTokenFromLocalStorage();

    function patchedProfile() {
      goto(`/provider/profile/${providerId}`);
    };
  
    async function updateProfile(evt) {
      evt.preventDefault();
      clicked = true;
  
      const profileData = {
        id: providerId,
        photo_url: fileUrl,
        name: evt.target['name'].value,
        hourly_rate: parseInt(evt.target['hourly_rate'].value),
        description: evt.target['description'].value,
      };
  
      const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/providers/update-profile`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(profileData)
      });

      const responseData = await resp.json();
      console.log(responseData);
  
      if (resp.status == 200) {
          clicked = false;
          patchedJob();
      } else {
        clicked = false;
      };
    };
</script>

<div class="antialiased bg-gray-50 dark:bg-gray-900">
    <main class="items-center h-auto px-4 py-20">
        <section class="bg-white shadow-md dark:bg-gray-800 rounded-lg w-full max-w-screen-md mx-auto mb-8 px-4 lg:px-8">
            <!-- First Row -->
            <div class="flex justify-between items-center pt-4">
                <h5 class="font-semibold dark:text-white">Info</h5>
                {#if providerId}
                <button on:click={() => editModalOpen = true} class="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="button">
                    Edit
                </button>
                {/if}
            </div>
            <!-- Line -->
            <hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700">
            <!-- Second Row -->
            <div class="gap-8 items-center p-4 md:grid md:grid-cols-2">
                <div class="flex justify-center">
                    <img class="w-64 h-64 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="{data.provider.photo_url}" alt="profile photo" />
                </div>
                <div class="mt-4">
                    <h2 class="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">{data.provider.name}</h2>
                    <p class="mb-4 text-xl font-extrabold leading-none text-gray-900 md:text-2xl dark:text-white">${data.provider.hourly_rate}/hr</p>
                    <dl>
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">About Me</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{data.provider.description}</dd>
                    </dl>
                </div>
            </div>
        </section>
    </main>
</div>

<!-- "Edit" modal -->
{#if editModalOpen}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Edit Profile
              </h3>
              <form on:submit|preventDefault={updateProfile} class="mt-4 space-y-4">
                <div>
                  <label for="edit-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                  <input type="text" id="edit-name" name="name" value={data.provider.name} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <!-- Add more fields here for other provider properties... -->
                <button type="submit" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update</button>
              </form>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" on:click={() => editModalOpen = false}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}