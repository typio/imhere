<script>
	import '../app.css';
	import { browser } from '$app/environment';

	import Analytics from '$lib/components/Analytics.svelte';
	import HeaderButtons from '$lib/components/HeaderButtons.svelte';

	const appHeight = () => {
		const doc = document.documentElement;
		doc.style.setProperty('--app-height', `${window.innerHeight}px`);
	};

	if (browser) {
		appHeight();
	}
</script>

<svelte:window
	on:resize={() => {
		appHeight();
	}}
/>

<Analytics />

<HeaderButtons />

<slot />
