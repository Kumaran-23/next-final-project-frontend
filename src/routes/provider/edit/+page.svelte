<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let formErrors = {};
	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let hourlyRate = '';
	let photo = null;
	let providerData = '';

	onMount(async () => {
		try {
			const response = await fetch(
				PUBLIC_BACKEND_BASE_URL + '/providers/edit' + localStorage.getItem('email')
			);
			userData = await response.json();
		} catch (error) {
			console.error(error);
		}
	});

	function postupdateProvider() {
		goto('/');
	}

	async function updateProvider(event) {
		event.preventDefault();
		const providerData = {
			username,
			email,
			password,
			confirmPassword,
			hourlyRate
		};
		try {
			const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/edit', {
				method: 'PATCH',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(providerData)
			});
			if (resp.ok) {
				showAlert('Profile has been updated successfully', 'success');
				postupdateProvider();
			} else {
				const res = await resp.json();
				formErrors = res.error;
			}
		} catch (error) {
			console.log('An error occurred:', error);
		}
	}
</script>

<h1 class="text-center text-xl pt-[100px]">Edit Profile</h1>
<div class="text-center hover" />
<div class="flex justify-center items-center mt-8">
	<form on:submit={updateProvider} class="w-1/3">
		<div class="form-control w-full">
			<label class="label" for="name">
				<span class="label-text">Username</span>
			</label>
			<input
				type="text"
				name="name"
				placeholder={providerData.name}
				class="input input-bordered w-full"
				required
			/>
			{#if 'name' in formErrors}
				<label class="label" for="name">
					<span
						class="label-text-alt
text-red-500">{formErrors['name'].message}</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label class="label" for="email">
				<span class="label-text">Email</span>
			</label>
			<input
				type="email"
				name="email"
				placeholder={providerData.email}
				class="input input-bordered w-full"
				required
			/>
			{#if 'email' in formErrors}
				<label class="label" for="email">
					<span
						class="label-text-alt
text-red-500">{formErrors['email'].message}</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text">Password</span>
			</label>
			<input
				type="password"
				name="password"
				placeholder=""
				class="input
input-bordered w-full"
				required
			/>
			{#if 'password' in formErrors}
				<label class="label" for="password">
					<span
						class="label-text-alt
text-red-500">{formErrors['password'].message}</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text">Confirm Password</span>
			</label>
			<input
				type="password"
				name="password-confirmation"
				placeholder=""
				class="input input-bordered w-full"
				required
			/>
			{#if 'password' in formErrors}
				<label class="label" for="password">
					<span
						class="label-text-alt
text-red-500">{formErrors['password'].message}</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label class="label" for="hourly_rate">
				<span class="label-text">Hourly Rate</span>
			</label>
			<input
				type="text"
				name="hourly_rate"
				placeholder={providerData.hourlyRate}
				class="input input-bordered w-full"
				required
			/>
			{#if 'password' in formErrors}
				<label class="label" for="password">
					<span
						class="label-text-alt
text-red-500">{formErrors['password'].message}</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label class="label" for="description">
				<span class="label-text">Description</span>
			</label>
			<input
				type="textarea"
				name="description"
				placeholder={providerData.description}
				class="input input-bordered w-full"
				required
			/>
			{#if 'password' in formErrors}
				<label class="label" for="desription">
					<span
						class="label-text-alt
text-red-500">{formErrors['password'].message}</span
					>
				</label>
			{/if}
		</div>
		<label for="photo">Photo:</label>
		<input type="file" id="photo" bind:files={photo} accept="image/*" /><br />
		<button type="submit">Save Changes</button>
	</form>
</div>
