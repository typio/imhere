<script>
	import '../app.css';
	import { browser } from '$app/environment';

	import ModeButton from '$lib/components/ModeButton.svelte';

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

<ModeButton />

<slot />
