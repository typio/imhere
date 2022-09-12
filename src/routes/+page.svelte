<script lang="ts">
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';

	import { browser } from '$app/environment';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import { codeLength } from '$lib/helper';
	import { page } from '$app/stores';

	let code = new Array(codeLength).fill('');

	let activeCodeIdx = 0;

	let keyboardType = 'digit';

	let name = '';

	let badCode = false;
	let failedSumbit = false;

	if (browser) {
		document.getElementById(`code-0`)?.focus();
	}

	const checkValidRoomCode = async (roomCode: string): Promise<boolean> => {
		const res = await fetch(
			`${$page.url.origin}/create/room?roomCode=${roomCode}`,
			{
				method: 'GET'
			}
		);
		const { exists }: { exists: boolean } = await res.json();
		return exists;
	};

	const submitHere = async (): Promise<boolean> => {
		toast.pop(0);
		toast.push('Joining Room...', { target: 'joining' });

		const res = await fetch(`${$page.url.origin}/create/room`, {
			method: 'PATCH',
			body: JSON.stringify({
				code: code.join(''),
				name
			})
		});
		const room = await res.json();
		if (room?.roomCode !== undefined) return true;
		else {
			toast.pop(0);
			toast.push(room.message);
			return false;
		}
	};

	const options = { intro: { y: -50 }, dismissable: false, initial: 0, next: 1 };
</script>

<svelte:head>
	<title>Im Here!</title>
</svelte:head>

<svelte:window
	on:keydown={(e) => {
		let { key } = e;
		if (keyboardType === 'digit') {
			if (!isNaN(parseInt(key))) {
				if (activeCodeIdx < codeLength - 1) {
					code[activeCodeIdx] = e.key;
					activeCodeIdx++;
					document.getElementById(`code-${activeCodeIdx}`)?.focus();
				} else if (activeCodeIdx === codeLength - 1) {
					code[activeCodeIdx] = e.key;

					(async () => {
						if (await checkValidRoomCode(code.join(''))) {
							keyboardType = 'alpha';
							setTimeout(() => {
								document.getElementById(`name-entry`)?.focus();
							}, 10);
						} else {
							badCode = true;
							setTimeout(() => {
								badCode = false;
							}, 1000);
						}
					})();
				}
			} else if (key === 'Backspace') {
				if (activeCodeIdx > 0) {
					code[activeCodeIdx] = '';
					activeCodeIdx--;
					document.getElementById(`code-${activeCodeIdx}`)?.focus();
				} else if (activeCodeIdx === 0) {
					code[activeCodeIdx] = '';
				}
			} else if (key === 'ArrowRight') {
				if (activeCodeIdx < codeLength - 1) {
					activeCodeIdx++;
					document.getElementById(`code-${activeCodeIdx}`)?.focus();
				}
			} else if (key === 'ArrowLeft') {
				if (activeCodeIdx > 0) {
					activeCodeIdx--;
					document.getElementById(`code-${activeCodeIdx}`)?.focus();
				}
			}
		} else {
			document.getElementById(`name-entry`)?.focus();
			if (key === 'Backspace') {
				if (name === '') {
					keyboardType = 'digit';
					// code[activeCodeIdx] = '';
					// activeCodeIdx--;
					document.getElementById(`code-${activeCodeIdx}`)?.focus();
				} else {
					name = name.slice(0, name.length - 1);
				}
			} else if (key.length === 1 && key.match(/[A-Z|a-z|ü|é| ]/i)) {
				if (name.length === 0 || name[name.length - 1] === ' ') {
					if (key !== ' ') {
						name += key.toUpperCase();
					}
				} else {
					name += key.toLowerCase();
				}
			}
		}
	}}
/>

<div class="wrap">
	<SvelteToast {options} />
</div>

<div class="content">
	{#if keyboardType === 'digit'}
		<div class="code-entry">
			<h1>Enter PIN</h1>
			{#each code as _, i}
				<div
					class="code-entry-cell {badCode ? 'shaker' : ''}"
					id="code-{i}"
					tabindex="0"
					on:focus={() => {
						keyboardType = 'digit';
						activeCodeIdx = i;
					}}
				>
					<p>{code[i]}</p>
				</div>
			{/each}
		</div>

		<!-- {#if code.filter((el) => el !== '').length === codeLength} -->
	{:else if keyboardType === 'alpha'}
		<div
			class="name-entry"
			id="name-entry"
			tabindex="0"
			on:focus={() => {
				keyboardType = 'alpha';
			}}
		>
			<h1>Enter Name</h1>
			<p>
				{name}
			</p>
		</div>
		<button
			class="btn here-btn pink-btn {failedSumbit ? 'shaker' : ''}"
			tabindex="0"
			on:click={async () => {
				if (!(await submitHere())) {
					failedSumbit = true;
					// @ts-ignore
					toast.pop((i) => i.target !== 'joining');
					setTimeout(() => {
						failedSumbit = false;
					}, 1000);
				} else {
					window.location.href = `/@${code.join('')}`;
				}
			}}>Here!</button
		>
	{/if}
	<div class="keyboard-wrapper">
		<!-- svelte-ignore missing-declaration -->
		<Keyboard
			type={keyboardType}
			on:key={(e) => {
				window.dispatchEvent(
					new KeyboardEvent('keydown', { key: e.detail.text })
				);
			}}
		/>
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

	h1 {
		width: 100%;
		font-size: 2rem;
		height: 2rem;
		text-align: center;
	}

	.code-entry {
		width: 100%;
		height: fit-content;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-self: flex-start;
	}

	.name-entry,
	.code-entry {
		margin: 75px 0 0 0;
	}

	.code-entry-cell {
		max-width: 3rem;
		height: 4rem;
		flex: 1;
		border: solid 0.4rem #480ca8;

		-webkit-border-radius: 15px;

		border-radius: 20px;
		margin: 0 0.6rem;
	}

	.code-entry-cell:focus {
		border: solid 0.4rem rgba(230, 230, 230, 0.3);
		outline: none;
	}

	.code-entry-cell p {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 2.4rem;
		line-height: 4rem;
		font-weight: 600;
		margin: 0;
	}

	.name-entry {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		align-self: flex-start;
	}

	.name-entry:focus {
		outline: none;
	}

	.name-entry p {
		border: solid 0.4rem rgba(230, 230, 230, 0.3);
		border-radius: 20px;

		text-align: center;
		width: 80%;
		height: 4rem;
		line-height: 4rem;
		margin: 0;
		font-size: 1.6rem;
		font-weight: 500;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.here-btn {
		margin: 50px auto 400px auto;
		font-size: 1.4rem;
		font-weight: 500;
		width: 100px;
		height: 50px;
	}

	.keyboard-wrapper {
		max-width: 540px;
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		bottom: 0;
		text-align: center;

		position: absolute;
	}

	.shaker:nth-of-type(1) {
		animation-name: shake;
		animation-duration: 0.25s;
	}

	.shaker:nth-of-type(2) {
		animation-name: shake;
		animation-duration: 0.3s;
		animation-direction: alternate;
	}

	.shaker:nth-of-type(3) {
		animation-name: shake;
		animation-duration: 0.2s;
	}

	.shaker:nth-of-type(4) {
		animation-name: shake;
		animation-duration: 0.275s;
		animation-direction: alternate;
	}

	@keyframes shake {
		0% {
			transform: translate(1px, 1px) rotate(0deg);
		}
		10% {
			transform: translate(-1px, -2px) rotate(-1deg);
		}
		20% {
			transform: translate(-3px, 0px) rotate(1deg);
		}
		30% {
			transform: translate(3px, 2px) rotate(0deg);
		}
		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}
		50% {
			transform: translate(-1px, 2px) rotate(-1deg);
		}
		60% {
			transform: translate(-3px, 1px) rotate(0deg);
		}
		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}
		80% {
			transform: translate(-1px, -1px) rotate(1deg);
		}
		90% {
			transform: translate(1px, 2px) rotate(0deg);
		}
		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}
</style>
