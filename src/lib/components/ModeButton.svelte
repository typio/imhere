<script>
	import { page } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';
</script>

{#if $page.url.pathname === '/'}
	<button
		class="mode-btn btn"
		on:click={() => {
			goto('/create');
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
			goto('/');
		}}
		on:mouseenter={() => {
			prefetch('/');
		}}
	>
		Student?
	</button>
{/if}

<style>
	.mode-btn {
		position: absolute;
		top: 30px;
		left: 30px;
		width: 110px;
	}
</style>
