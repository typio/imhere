<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="content">
	<div class="error">
		<h1>{$page.status}</h1>
		<p>{$page.error.message}</p>
	</div>
</div>

<style>
	.error {
		padding-top: 35vh;
		width: 100%;
	}
	h1 {
		margin-top: 0;
		text-align: center;
		font-size: 5vmin;
	}

	p {
		width: 100%;
		text-align: center;
		font-weight: 600;
		font-size: 3vmin;
	}
</style>
