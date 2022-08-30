<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<h1>{$page.status}</h1>
<p>{$page.error.message}</p>

<style>
	h1 {
		text-align: center;
		padding-top: 14vh;
	}

	p {
		text-align: center;
		font-weight: 600;
	}
</style>
