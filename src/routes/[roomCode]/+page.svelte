<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';

	import type { PageData } from './$types';

	export let data: PageData;

	let msRemaining: number,
		hoursRemaining: number,
		minutesRemaining: number,
		secondsRemaining: number;

	const calcTime = () => {
		let currentTime = new Date().getTime();
		msRemaining = new Date(data?.room?.expiresAt).getTime() - currentTime;

		hoursRemaining = Math.floor(
			(msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		minutesRemaining = Math.floor(
			(msRemaining % (1000 * 60 * 60)) / (1000 * 60)
		);
		secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
	};

	calcTime();
	const interval = setInterval(async () => {
		if (data?.room !== undefined) {
			if (browser) invalidateAll();
			calcTime();
		} else {
			clearInterval(interval);
		}
	}, 100);

	const downloadToFile = (
		content: string,
		filename: string,
		contentType: string
	) => {
		const a = document.createElement('a');
		const file = new Blob([content], { type: contentType });

		a.href = URL.createObjectURL(file);
		a.download = filename;
		a.click();

		URL.revokeObjectURL(a.href);
	};
</script>

<svelte:head>
	<title>Room{data?.room?.roomCode ? ` #${data?.room?.roomCode}` : ''}</title>
</svelte:head>

<div class="content">
	{#if data?.room !== undefined}
		<h1 class="room-code">{data?.room.roomCode}</h1>
		<h2 class="room-time">
			{(msRemaining > 3.6 * 10 ** 6 ? hoursRemaining + 'h ' : '') +
				(msRemaining > 6 * 10 ** 4 ? minutesRemaining + 'm ' : '') +
				(msRemaining > 10 ** 3 ? secondsRemaining + 's' : '')}
		</h2>
		<ul class="student-names">
			{#each data?.room?.students?.reverse() as student}
				<li
					class="student-name"
					on:click={async () => {
						await fetch('/create/room', {
							method: 'DELETE',
							body: JSON.stringify({
								roomCode: data?.room.roomCode,
								studentId: student?.split('/')[0]
							})
						});
					}}
				>
					{student?.split('/')[1]}
				</li>
			{/each}
		</ul>
		<div class="save-btns">
			<button
				class="btn clip-btn"
				on:click={() => {
					navigator.clipboard.writeText(
						data?.room?.students.map((student) => student.split('/')[1])
					);
				}}>Copy Names to Clipboard</button
			>
			<button
				class="btn save-btn"
				on:click={() => {
					downloadToFile(
						data?.room?.students.map((student) => student.split('/')[1]),
						`Attendance-${new Date().toLocaleString('en-US')}`,
						'text/plain'
					);
				}}>Save Names to Text File</button
			>
		</div>
		<style>
			.content {
				max-width: 100%;
			}
		</style>
	{:else if data?.isStudent === true}
		<h2 class="msg">You've successfully joined the room!</h2>
	{:else}
		<h2 class="msg">This room has expired</h2>
	{/if}
</div>

<style>
	h1,
	h2 {
		width: 100%;
		text-align: center;
	}

	.room-code {
		font-size: 16vmin;
		line-height: 18vmin;
		height: 18vmin;
		margin: 70px 0 0 0;
	}

	.room-time {
		font-weight: 500;
		font-size: 5vmin;
		line-height: 6vmin;
		height: 6vmin;
		margin: 0;
	}

	.student-names {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		max-height: 60vh;
		margin: auto 0 0 0;
		list-style: none;
		-webkit-box-pack: center;
		justify-content: center;
		padding: 0;
		height: 40vh;
	}

	.student-name {
		font-weight: 600;
		font-size: 3.5vmin;
		line-height: 5vmin;
		height: 5vmin;

		text-align: center;
		margin: 10px;
		/* 
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.4rem; */
	}

	.student-name:hover {
		text-decoration: line-through;
	}

	.msg {
		margin: 35vh auto 0 auto;
		max-width: 75vw;
	}

	.home-btn {
		margin: 0 auto;
	}

	.save-btns {
		position: absolute;
		bottom: 30px;
		width: 100%;
		text-align: center;
	}

	.save-btns .btn {
		margin: 10px 20px;
	}
</style>
