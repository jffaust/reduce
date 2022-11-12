<script lang="ts">
	import type { Operation, Point2D } from '$lib/core/Common';

	export let boardSizePx: number;
	export let cannotDivideReason: string;
	export let handleMathOpClick: (op: Operation) => void;

	$: btnSize = boardSizePx * 0.13;
	$: divStyle = `width: ${boardSizePx}px;`;
	$: btnStyle = `font-size: ${btnSize * 0.5}px;width: ${btnSize}px; height: ${btnSize}px;`;

	function handleButtonClick(op: Operation) {
		handleMathOpClick(op);
		(document.activeElement as HTMLElement).blur();
	}
</script>

<div style={divStyle}>
	<button style={btnStyle} on:click={() => handleButtonClick('+')}>+</button>
	<button style={btnStyle} on:click={() => handleButtonClick('-')}>−</button>
	<button style={btnStyle} on:click={() => handleButtonClick('*')}>×</button>
	{#if cannotDivideReason}
		<button style={btnStyle} class="disabled" title={cannotDivideReason}>÷</button>
	{:else}
		<button style={btnStyle} on:click={() => handleButtonClick('/')}>÷</button>
	{/if}
</div>

<style>
	div {
		margin: 5vh auto;
		display: flex;
		justify-content: space-around;
	}
	button {
		background: #e5f0e2;
		color: #64748b;
		border: unset;
		border-radius: 50%;
		cursor: pointer;
		font-size: xx-large;
	}
	button:hover {
		background: #c9ddc4;
		color: #475569;
	}
	button:focus {
		background: #b8cfb2;
	}

	button.disabled {
		cursor: not-allowed;
		color: #64748b !important;
		background: lightcoral !important;
	}
</style>
