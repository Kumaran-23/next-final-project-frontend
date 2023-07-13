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

<div class="container mx-auto px-24 py-12">
  <h1 class="text-center text-xl">Select your availability</h1>

  {#if isLoading}
    <p>Loading availability...</p>
  {:else}
    {#each availability as item, id (id)}
    <div class="grid grid-cols-3 gap-4" key={id}>
      <div class="text-center my-4">
        <p>{item.day}</p>
      </div>

      <div class="my-4">
        <label class="label" for={`start_at-${id}`}>Start Time</label>
        <select
          name="start_at"
          id={`start_at-${id}`}
          class="select select-bordered w-full max-w-xs"
          on:change={(event) => handleTimeChange(event, id)}
        >
        {#each time as t (t.id)}
          <option value={t.t} id={t.id} selected={t.t === item.start_at}>{t.t}</option>
        {/each}
        </select>
      </div>

      <div class="my-4">
        <label class="label" for={`end_at-${id}`}>End Time</label>
        <select
          name="end_at"
          id={`end_at-${id}`}
          class="select select-bordered w-full max-w-xs"
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

  <div class="flex justify-center items-center m-8">
    <button
      class="btn btn-primary"
      on:click={ handleSaveAvailability }
    >
      Save Availability
    </button>
  </div>
</div>