<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	$: teacher_mode = $page.url.pathname === '/create' ? true : false;
</script>

<button
	class="mode-btn btn"
	on:click={() => {
		goto(teacher_mode ? '/' : '/create');
	}}>{teacher_mode ? 'Student?' : 'Teacher?'}</button
>

<style>
	.mode-btn {
		position: absolute;
		top: 30px;
		left: 30px;
	}
</style>
