<script lang="ts">
	import { page } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';

	import mute from '$lib/assets/mute.svg';
	import volume_lowest from '$lib/assets/volume_lowest.svg';
	import volume_middle from '$lib/assets/volume_middle.svg';
	import volume_max from '$lib/assets/volume_max.svg';
	import soundtrack from '$lib/assets/soundtrack.mp3';

	let volumeLevel = 1;
	let muted = true;

	let audio: HTMLAudioElement;

	$: {
		if (audio) {
			audio.volume = volumeLevel / 20;
			if (muted) audio.volume = 0;
			if (volumeLevel === 0) {
				muted = true;
				volumeLevel = 1;
			}
		}
	}

	let showVolume = false;
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

{#if $page.url.pathname[1] === '@'}
	<audio
		loop
		src={soundtrack}
		bind:this={audio}
		on:timeupdate={() => {
			let buffer = 0.44;
			if (audio.currentTime > audio.duration - buffer) {
				audio.currentTime = 0;
				audio.play();
			}
		}}
	/>

	<div
		class="sound-control"
		style="width:{showVolume && !muted ? '160px' : '40px'}"
		on:mousemove={() => {
			showVolume = true;
		}}
		on:mouseleave={() => {
			showVolume = false;
		}}
	>
		<button
			class="btn"
			on:click={() => {
				muted = !muted;
				audio.play();
				audio.volume = volumeLevel / 20;
			}}
		>
			<img
				src={muted === true
					? mute
					: volumeLevel < 5
					? volume_lowest
					: volumeLevel < 15
					? volume_middle
					: volume_max}
				alt=""
			/>
		</button>

		<input
			class="sound-slider"
			style="display: {showVolume && !muted ? 'block' : 'none'}"
			type="range"
			min="0"
			max="20"
			bind:value={volumeLevel}
		/>
	</div>
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

	.sound-control {
		position: absolute;
		top: 90px;
		left: 30px;
		height: 40px;
		width: 40px;
		background-color: #f1f1f1;
		border-radius: 20px;
		box-shadow: 1px 2px 7px #333;
	}

	.sound-control .btn {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 100%;
		box-shadow: none;
		align-items: center;
	}

	.sound-control .btn img {
		margin-top: 2px;
		height: 16px;
		position: absolute;
		left: 10px;
		top: 10px;
		/* object-fit: fill; */
	}

	.sound-slider {
		position: absolute;
		width: 100px;
		height: 40px;
		left: 40px;
		margin: 0;
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
