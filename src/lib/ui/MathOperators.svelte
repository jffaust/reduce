<script lang="ts">
	import type { Operation, Point2D } from '$lib/core/Common';

	export let boardSizePx: number;
	export let cannotDivideReason: string;
	export let handleMathOpClick: (op: Operation) => void;

	$: btnSize = boardSizePx * 0.13;
	$: divStyle = `width: ${boardSizePx}px;`;
	$: btnStyle = `font-size: ${btnSize * 0.5}px;width: ${btnSize}px; height: ${btnSize}px;`;
</script>

<div style={divStyle}>
	<button style={btnStyle} on:click={() => handleMathOpClick('+')}>+</button>
	<button style={btnStyle} on:click={() => handleMathOpClick('-')}>−</button>
	<button style={btnStyle} on:click={() => handleMathOpClick('*')}>×</button>
	{#if cannotDivideReason}
		<button style={btnStyle} class="disabled" title={cannotDivideReason}>÷</button>
	{:else}
		<button style={btnStyle} on:click={() => handleMathOpClick('/')}>÷</button>
	{/if}
</div>

<style>
	div {
		margin: 5vh auto;
		display: flex;
		justify-content: space-around;
	}
	button {
		background: #e2e8f0;
		color: #64748b;
		border: unset;
		border-radius: 50%;
		cursor: pointer;
		font-size: xx-large;
	}
	button:hover {
		background: #cbd5e1;
		color: #475569;
	}
	button:focus {
		background: #94a3b8;
		color: #f1f5f9;
	}

	button.disabled {
		cursor: not-allowed;
		background: lightcoral !important;
	}
</style>
