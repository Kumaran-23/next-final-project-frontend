<script>
  import { onMount } from "svelte";
  import { PUBLIC_BACKEND_BASE_URL } from "$env/static/public";
  import { getTokenFromLocalStorage } from "../../../utils/auth.js";
  import { time } from "../../../utils/time.js";

  export let availability = null;
  let isLoading = true;

  onMount(() => {
    availability = [
      { day: "Sun", start_at: "", end_at: "" },
      { day: "Mon", start_at: "", end_at: "" },
      { day: "Tue", start_at: "", end_at: "" },
      { day: "Wed", start_at: "", end_at: "" },
      { day: "Thu", start_at: "", end_at: "" },
      { day: "Fri", start_at: "", end_at: "" },
      { day: "Sat", start_at: "", end_at: "" },
    ];
    isLoading = false;
  });
  
  const handleTimeChange = (event, id) => {
    const { name, value } = event.target;

    // Handle placeholder values
    if (value === "Select") return;

    // Create a new array with the modified values
    availability = availability.map((item, index) => {
      if (index === id) {
        return {
          ...item,
          [name]: value,
        };
      }
      return item;
    });
  };
  
  // Validate start time and end time inputs
  const handleSaveAvailability = () => {
    let isValid = true;

    for (const item of availability) {
      if (item.start_at && item.end_at) {
        const startTime = parseInt(item.start_at);
        const endTime = parseInt(item.end_at);

        if (endTime <= startTime) {
          alert("End time cannot be earlier than or equal to start time!");
          isValid = false;
          break;
        };
      } else if (item.start_at || item.end_at) {
          alert("Both start time and end time must be filled out!");
          isValid = false;
          break;
      }
    };

    if (isValid) {
      const filteredAvailability = availability.filter(
        (item) => item.start_at || item.end_at
      );
      console.log(filteredAvailability);
      handleCreateAvailability(filteredAvailability);
    };
  };

  async function handleCreateAvailability(availability) {
    const token = getTokenFromLocalStorage();

    try {
      await fetch(PUBLIC_BACKEND_BASE_URL + "/availability", {
        method: "POST",
        body: JSON.stringify({
          availability,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    };
  };
</script>

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
            Your Availability
          </h1>
          
          {#if isLoading}
            <p>Loading availability...</p>
          {:else}
            {#each availability as item, id (id)}
            <div class="grid grid-cols-3 gap-4 lg:gap-8" key={id}>
              <div class="items-center text-center">
                <p class="block mt-6 text-m font-medium text-gray-900 dark:text-white">{item.day}</p>
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for={`start_at-${id}`}>Start Time</label>
                <select
                  name="start_at"
                  id={`start_at-${id}`}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  on:change={(event) => handleTimeChange(event, id)}
                >
                {#each time as t (t.id)}
                  <option value={t.t} id={t.id} selected={t.t === item.start_at}>{t.t}</option>
                {/each}
                </select>
              </div>
        
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for={`end_at-${id}`}>End Time</label>
                <select
                  name="end_at"
                  id={`end_at-${id}`}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  on:change={(event) => handleTimeChange(event, id)}
                >
                  {#each time as t (t.id)}
                    <option value={t.t} id={t.id} selected={t.t === item.end_at}>{t.t}</option>
                  {/each}
                </select>
              </div>
            </div>
            {/each}
          {/if}

          <button on:click={ handleSaveAvailability } class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full">Save Availability</button>
        </div>
      </div>
    </div>
  </main>
</div>