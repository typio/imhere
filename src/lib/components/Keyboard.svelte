<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type = 'digit';

	let interval: NodeJS.Timer;

	const sendKey = (key: string) => {
        dispatch('key', {
			text: key
		});
	};
</script>

<div class="keyboard">
	{#if type === 'digit'}
		<div class="keyboard-row">
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('1');
				}}
				>1</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('2');
				}}
				>2</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('3');
				}}
				>3</button
			>
		</div>
		<div class="keyboard-row">
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('4');
				}}
				>4</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('5');
				}}
				>5</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('6');
				}}
				>6</button
			>
		</div>
		<div class="keyboard-row">
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('7');
				}}
				>7</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('8');
				}}
				>8</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('9');
				}}
				>9</button
			>
		</div>
		<div class="keyboard-row">
			<div class="keyboard-cell hide-cell btn" />
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('0');
				}}
				>0</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
                    sendKey('Backspace');
                    interval = setInterval(sendKey, 100, 'Backspace')
				}}

                on:mouseup={(e)=>{
                    e.preventDefault();
                    clearInterval(interval)
                }}
				>⌫</button
			>
		</div>
	{:else if type === 'alpha'}
		<div class="keyboard-row">
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('Q');
				}}
				>Q</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('W');
				}}
				>W</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('E');
				}}
				>E</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('R');
				}}
				>R</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('T');
				}}
				>T</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('Y');
				}}
				>Y</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('U');
				}}
				>U</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('I');
				}}
				>I</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('O');
				}}
				>O</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('P');
				}}
				>P</button
			>
		</div>
		<div class="keyboard-row">
			<div class="keyboard-cell-half" />
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('A');
				}}
				>A</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('S');
				}}
				>S</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('D');
				}}
				>D</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('F');
				}}
				>F</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('G');
				}}
				>G</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('H');
				}}
				>H</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('J');
				}}
				>J</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('K');
				}}
				>K</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('L');
				}}
				>L</button
			>
			<div class="keyboard-cell-half" />
		</div>
		<div class="keyboard-row">
			<div class="keyboard-cell-half" />
			<div class="keyboard-cell-half" />
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('Z');
				}}
				>Z</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('X');
				}}
				>X</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('C');
				}}
				>C</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('V');
				}}
				>V</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('B');
				}}
				>B</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('N');
				}}
				>N</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey('M');
				}}
				>M</button
			>
			<div class="keyboard-cell-half" />
			<div class="keyboard-cell-half" />
		</div>
		<div class="keyboard-row">
			<div class="keyboard-cell hide-cell btn" />
			<button
				class="keyboard-cell wide-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
					sendKey(' ');
				}}
				>SPACE</button
			>
			<button
				class="keyboard-cell btn"
				on:mousedown={(e) => {
					e.preventDefault();
                    sendKey('Backspace');
                    interval = setInterval(sendKey, 100, 'Backspace')
				}}

                on:mouseup={(e)=>{
                    e.preventDefault();
                    clearInterval(interval)
                }}
				>⌫</button
			>
		</div>
	{/if}
</div>

<style>
	.keyboard {
		user-select: none;
		margin: 0 8px;
	}

	.keyboard-row {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		margin: 0 0 8px 0;
	}

	.keyboard-cell {
		padding: 0;
		flex: 1;
		border-radius: 6px;
		height: 58px;
		text-align: center;
		margin: 0 2px;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.keyboard-cell:active {
		background-color: #aaa;
	}

	.keyboard-cell-half {
		text-align: center;
		flex: 1;
		margin: 0 2px;
	}

	.wide-cell {
		flex: 5;
	}

	.hide-cell {
		opacity: 0;
	}
</style>
