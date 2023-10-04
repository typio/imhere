<script lang="ts">
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';

	let TTLInSeconds = 60 * 15;

	const createRoom = async () => {
		toast.push('Creating Room!');

		const res = await fetch('/create/room', {
			method: 'POST',
			body: JSON.stringify({
				TTLInSeconds
			})
		});

		let { room } = await res.json();
		toast.pop();
		window.location.href = `/@${room.roomCode}`;
	};

	const options = { intro: { y: -50 }, dismissable: false, initial: 0, next: 1 };
</script>

<svelte:head>
	<title>Create Room!</title>
</svelte:head>

<div class="wrap">
	<SvelteToast {options} />
</div>

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
			class="btn create-btn pink-btn"
			on:click={async () => {
				createRoom();
			}}>Create Room</button
		>
	</div>
</div>

<style>
	:root {
		--toastContainerTop: 60px;
		--toastContainerRight: auto;
		--toastContainerBottom: auto;
		--toastContainerLeft: calc(50vw - 8rem);
		--toastColor: #000;
		--toastBackground: #f1f1f1;
		--toastBarBackground: #c53030;
		--toastBorderRadius: 0.4rem;
	}

	.wrap {
		font-size: 1rem;
		font-weight: 500;
		text-align: center;
	}

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
		gap: 10px 10px;
		align-items: center;
	}

	.ttl-btns .btn {
		background: rgb(102, 14, 29);
		color: gray;
		width: 100px;
		height: 40px;
		font-size: 16px;
		border-radius: 8px;
	}

	.ttl-btns .active-btn {
		background: rgb(223, 37, 68);
		color: #fff;
	}

	.create-btn {
		margin: 0 auto 0 auto;
		width: 160px;
		height: 60px;
		font-size: 18px;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(169, 28, 51, 0.3);
	}
</style>
