<script>
	import { page } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';
</script>

{#if $page.url.pathname === '/'}
	<button
		class="mode-btn btn"
		on:click={() => {
			window.location.href = '/create';
		}}
		on:mouseenter={() => {
			prefetch('/create');
		}}
	>
		Teacher?
	</button>
{:else if $page.url.pathname === '/create'}
	<button
		class="mode-btn btn"
		on:click={() => {
			window.location.href = '/';
		}}
		on:mouseenter={() => {
			prefetch('/');
		}}
	>
		Student?
	</button>
{:else}
	<button
		class="mode-btn btn"
		on:click={() => {
			window.location.href = '/';
		}}
		on:mouseenter={() => {
			prefetch('/');
		}}
	>
		Home
	</button>
{/if}

<button
	class="about-btn btn"
	on:click={() => {
		window.location.href = '/about';
	}}
	on:mouseenter={() => {
		prefetch('/aboout');
	}}
>
	?
</button>

<style>
	.mode-btn {
		position: absolute;
		top: 30px;
		left: 30px;
		height: 40px;
		width: 110px;
	}
	.about-btn {
		position: absolute;
		top: 30px;
		right: 30px;
		width: 40px;
		height: 40px;
		border-radius: 100%;
	}
</style>
