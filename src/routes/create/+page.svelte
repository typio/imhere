<script lang="ts">
	let TTLInSeconds = 60 * 15;

	const createRoom = async () => {
		const res = await fetch('/create/room', {
			method: 'POST',
			body: JSON.stringify({
				TTLInSeconds
			})
		});

		let { room } = await res.json();
		window.location.href = `/${room.roomCode}`;
	};
</script>

<div class="content">
	<div class="create-btns">
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
		<button
			class="btn create-btn"
			on:click={async () => {
				await createRoom();
			}}>Create Room</button
		>
	</div>
</div>

<style>
	.create-btns {
		margin: 35vh 0 0 0;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.ttl-btns {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		height: fit-content;
		justify-content: space-evenly;
		gap: 10px 5px;
		align-items: center;
	}

	.active-btn {
		background: rgb(223, 37, 68);
		color: #fff;
	}

	.create-btn {
		margin: 0 auto 20vh auto;
	}
</style>
