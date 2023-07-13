<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { getTokenFromLocalStorage } from '../../../utils/auth.js';
	import { uploadMedia } from '../../../utils/s3-uploader.js';
	let formErrors = {};
	let clicked = false;

	function postJob() {
		goto('/');
	}

	async function uploadImage(evt) {
		evt.preventDefault();
		clicked = true;
		const [fileName, fileUrl] = await uploadMedia(evt.target['file'].files[0]);
		const token = getTokenFromLocalStorage();

		const imageData = {
			image_url: fileUrl
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/provider-image', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(imageData)
		});

		if (resp.status === 200) {
			postJob();
			console.log(typeof imageData.price);
		} else {
			const res = await resp.json();
			formErrors = res.data;
			clicked = false;
		}
	}
</script>

<svelte:head>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>

<div class="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 pb-[60px]">
	<h1 class="text-2xl text-center font-bold pt-20">Upload Image For Sale</h1>
	<div
		class="flex justify-center items-center bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
	>
		<form on:submit={uploadImage} class="w-1/3 mt-10">
			<div class="form-control w-full mt-5 mb-5">
				<input type="file" name="file" class="w-1/2" />
				{#if 'file' in formErrors}
					<label class="label" for="file">
						<span class="label-text-alt text-red-500">{formErrors['file']}</span>
					</label>
				{/if}
			</div>

			<div class="form-control w-full mb-10">
				{#if clicked}
					<button class="btn btn-md btn-primary hover:btn-accent loading">Upload Image</button>
				{:else}
					<button class="btn btn-md btn-primary hover:btn-accent">Upload Image</button>
				{/if}
			</div>
		</form>
	</div>
</div>