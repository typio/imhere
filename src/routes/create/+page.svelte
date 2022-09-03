<script lang="ts">
	import { goto } from '$app/navigation';

	let TTLInSeconds = 60 * 5;

	const createRoom = async () => {
		const res = await fetch('/create/createRoom', {
			method: 'POST',
			body: JSON.stringify({
				TTLInSeconds
			})
		});
		let { room } = await res.json();
		
		if (room.roomCode) goto(`/${room.roomCode}`);
	};
</script>

<div class="content">
	<button
		class="btn create-btn"
		on:click={() => {
			createRoom();
		}}>Create Room</button
	>
	<div class="ttl-btns">
		<button
			class="btn {TTLInSeconds === 60 * 5 ? 'active-btn' : ''}"
			on:click={() => {
				TTLInSeconds = 60 * 5;
			}}>5 min</button
		>
		<button
			class="btn {TTLInSeconds === 60 * 15 ? 'active-btn' : ''}"
			on:click={() => {
				TTLInSeconds = 60 * 15;
			}}>15 min</button
		>
		<button
			class="btn {TTLInSeconds === 60 * 60 ? 'active-btn' : ''}"
			on:click={() => {
				TTLInSeconds = 60 * 60;
			}}>1 hour</button
		>
		<button
			class="btn {TTLInSeconds === 60 * 60 * 12 ? 'active-btn' : ''}"
			on:click={() => {
				TTLInSeconds = 60 * 60 * 12;
			}}>12 hours</button
		>
	</div>
</div>

<style>
	.ttl-btns {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		justify-content: space-evenly;
	}

	.active-btn {
		background: rgb(223, 37, 68);
		color: #fff;
	}

	.create-btn {
		margin: 0 auto;
	}
</style>
