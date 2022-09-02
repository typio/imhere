<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Keyboard from '$lib/components/Keyboard.svelte';

	let code = ['', '', '', ''];
	let activeCodeIdx = 0;
	let codeLength = code.length;

	let keyboardType = 'digit';

	let name = '';

	if (browser) {
		document.getElementById(`code-0`)?.focus();
	}
</script>

<svelte:window
	on:keydown={(e) => {
		let { key } = e;
		console.log(key);

		if (keyboardType === 'digit') {
			if (!isNaN(parseInt(key))) {
				if (activeCodeIdx < codeLength - 1) {
					code[activeCodeIdx] = e.key;
					activeCodeIdx++;
					document.getElementById(`code-${activeCodeIdx}`)?.focus();
				} else if (activeCodeIdx === codeLength - 1) {
					code[activeCodeIdx] = e.key;
					keyboardType = 'alpha';
					setTimeout(() => {
						document.getElementById(`name-entry`)?.focus();
					}, 10);
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
					code[activeCodeIdx] = '';
					activeCodeIdx--;
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

<div class="content">
	<div class="code-entry">
		<h1>Enter PIN</h1>
		{#each code as _, i}
			<div
				class="code-entry-cell"
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

	{#if code.filter((el) => el !== '').length === codeLength}
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
		<button class="btn here-btn" tabindex="0">Here!</button>
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
		padding: 2vh 0;
		align-self: flex-start;
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
		background: linear-gradient(145deg, #f72585, #b5179e);
		margin: 2vh auto 0 auto;
		color: #f1f1f1;
		font-size: 1.4rem;
		font-weight: 500;
		width: 100px;
		height: 50px;
	}

	.keyboard-wrapper {
		width: 100%;
		align-self: flex-end;
	}
</style>
