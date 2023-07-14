<script>
    export let data;
    import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
    import { goto } from '$app/navigation';
    import { getUserID,getTokenFromLocalStorage } from '../../../../utils/auth.js';
    let formErrors = {};
    let clicked = false;
  
    function patchedJob() {
      goto(`/jobs/${data.job.id}`);
    }
  
    async function updateJob(evt) {
      evt.preventDefault();
      clicked = true;
      const getLocalData = getUserID();
      const getToken = getTokenFromLocalStorage();
  
      const jobData = {
        user: getLocalData,
        title: evt.target['title'].value,
        minAnnualCompensation: evt.target['minAnnualCompensation'].value,
        maxAnnualCompensation: evt.target['maxAnnualCompensation'].value,
        description: evt.target['description'].value,
        requirements: evt.target['requirements'].value,
        employer: evt.target['employer'].value,
        location: evt.target['location'].value,
        applicationInstructions: evt.target['applicationInstructions'].value
      };
  
      const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/api/collections/jobs/records/${data.job.id}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getToken
        },
        body: JSON.stringify(jobData)
      });
  
      if (resp.status === 200) {
          patchedJob();
        }
        else {
        const res = await resp.json();
        formErrors = res.data;
        clicked = false;
      }
    }
  </script>
  
  <h1 class="text-xl mb-5">Update a Job</h1>
  <div class="">
      <form on:submit={updateJob} class="w-full">
          <div class="form-control w-full mb-3">
              <label class="label" for="title">
                  <span class="label-text">Job Title</span>
              </label>
              <input value={data.job.title} type="text" name="title" placeholder="Web Developer" class="input input-bordered w-full" required />
              {#if 'title' in formErrors}
              <label class="label" for="title">
                  <span class="label-text-alt text-red-500">{formErrors['title'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-2">
              <label class="label" for="minAnnualCompensation">
                  <span class="label-text">Minimum Annual Compensation</span>
              </label>
              <input value={data.job.minAnnualCompensation} type="number" name="minAnnualCompensation" placeholder="40000" class="input input-bordered w-full" required />
              <label class="label" for="salary">
                <span class="label-text">USD per anum</span>
              </label>
              {#if 'email' in formErrors}
              <label class="label" for="minAnnualCompensation">
                  <span class="label-text-alt text-red-500">{formErrors['minAnnualCompensation'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-2">
              <label class="label" for="maxAnnualCompensation">
                  <span class="label-text">Maximum Annual Compensation</span>
              </label>
              <input value={data.job.maxAnnualCompensation} type="number" name="maxAnnualCompensation" placeholder="100000" class="input input-bordered w-full" required />
              <label class="label" for="salary">
                <span class="label-text">USD per anum</span>
              </label>
              {#if 'maxAnnualCompensation' in formErrors}
              <label class="label" for="maxAnnualCompensation">
                  <span class="label-text-alt text-red-500">{formErrors['maxAnnualCompensation'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-3">
              <label class="label" for="employer">
                  <span class="label-text">Company Name</span>
              </label>
              <input value={data.job.employer} type="text" name="employer" placeholder="e.g Lazada" class="input input-bordered w-full" required />
              {#if 'employer' in formErrors}
              <label class="label" for="employer">
                  <span class="label-text-alt text-red-500">{formErrors['employer'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-3">
              <label class="label" for="location">
                  <span class="label-text">Job Location</span>
              </label>
              <input value={data.job.location} type="text" name="location" placeholder="e.g Thailand, Remote..etc" class="input input-bordered w-full" required />
              {#if 'location' in formErrors}
              <label class="label" for="location">
                  <span class="label-text-alt text-red-500">{formErrors['location'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-3">
              <label class="label" for="description">
                  <span class="label-text">Description</span>
              </label>
              <textarea value={data.job.description} name="description" placeholder="e.g Job involves overseeing a team of Junior Software  Engineers" class="textarea textarea-bordered h-40" required ></textarea>
              {#if 'description' in formErrors}
              <label class="label" for="description">
                  <span class="label-text-alt text-red-500">{formErrors['description'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-3">
              <label class="label" for="requirements">
                  <span class="label-text">Requirements</span>
              </label>
              <textarea value={data.job.requirements} name="requirements" placeholder="e.g 5 years of experience in front-end development in online stores" class="textarea textarea-bordered h-40" required ></textarea>
              {#if 'requirements' in formErrors}
              <label class="label" for="requirements">
                  <span class="label-text-alt text-red-500">{formErrors['requirements'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-10">
              <label class="label" for="applicationInstructions">
                  <span class="label-text">Application Instructions</span>
              </label>
              <textarea value={data.job.applicationInstructions} name="applicationInstructions" placeholder="e.g Please email Resume and short description of intent to work with us to example@example.com" class="textarea textarea-bordered h-40" required ></textarea>
              {#if 'applicationInstructions' in formErrors}
              <label class="label" for="requirements">
                  <span class="label-text-alt text-red-500">{formErrors['applicationInstructions'].message}</span>
              </label>
              {/if}
          </div>
  
          <div class="form-control w-full mb-10">
              {#if clicked}
                  <button class="btn btn-md btn-primary hover:btn-accent loading">Update Job</button>
              {:else}
                  <button class="btn btn-md btn-primary hover:btn-accent">Update Job</button>
              {/if}
          </div>
      </form>
  </div>