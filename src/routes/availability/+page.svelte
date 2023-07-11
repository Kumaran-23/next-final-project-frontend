<script>
  import { PUBLIC_BACKEND_BASE_URL } from "$env/static/public";
  import { getTokenFromLocalStorage } from "../../utils/auth.js";
  import { time } from "../../utils/time.js";
  
  let availability = [
    { day: "Sun", startAt: "", endAt: "" },
    { day: "Mon", startAt: "", endAt: "" },
    { day: "Tue", startAt: "", endAt: "" },
    { day: "Wed", startAt: "", endAt: "" },
    { day: "Thu", startAt: "", endAt: "" },
    { day: "Fri", startAt: "", endAt: "" },
    { day: "Sat", startAt: "", endAt: "" },
  ];
  
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
      if (item.startAt && item.endAt) {
        const startTime = parseInt(item.startAt);
        const endTime = parseInt(item.endAt);

        if (endTime <= startTime) {
          alert("End time cannot be earlier than or equal to start time!");
          isValid = false;
          break;
        };
      } else if (item.startAt || item.endAt) {
          alert("Both start time and end time must be filled out!");
          isValid = false;
          break;
      }
    };

    if (isValid) {
      const filteredAvailability = availability.filter(
        (item) => item.startAt || item.endAt
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

  {#each availability as item, id (id)}
  <div class="grid grid-cols-3 gap-4" key={id}>
    <div class="text-center my-4">
      <p>{item.day}</p>
    </div>

    <div class="my-4">
      <label class="label" for={`startAt-${id}`}>Start Time</label>
      <select
        name="startAt"
        id={`startAt-${id}`}
        class="select select-bordered w-full max-w-xs"
        on:change={(event) => handleTimeChange(event, id)}
      >
      {#each time as t (t.id)}
        <option value={t.t} id={t.id}>{t.t}</option>
      {/each}
      </select>
    </div>

    <div class="my-4">
      <label class="label" for={`endAt-${id}`}>End Time</label>
      <select
        name="endAt"
        id={`endAt-${id}`}
        class="select select-bordered w-full max-w-xs"
        on:change={(event) => handleTimeChange(event, id)}
      >
        {#each time as t (t.id)}
          <option value={t.t} id={t.id}>{t.t}</option>
        {/each}
      </select>
    </div>
  </div>
  {/each}

  <div class="flex justify-center items-center m-8">
    <button
      class="btn btn-primary"
      on:click={ handleSaveAvailability }
    >
      Save Availability
    </button>
  </div>
</div>