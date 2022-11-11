<script lang="ts">
	import type { Operation, Point2D } from '$lib/core/Common';

	export let boardSizePx: number;
	export let boardOffsetPx: Point2D;
	export let cannotDivideReason: string;
	export let handleMathOpClick: (op: Operation) => void;

	let divStyle: string;

	$: {
		divStyle = 'position: fixed;';
		divStyle += `top: ${boardOffsetPx.y + boardSizePx + 50}px;`;
		divStyle += `left: ${boardOffsetPx.x}px; width: ${boardSizePx}px;`;
	}
</script>

<div style={divStyle}>
	<button on:click={() => handleMathOpClick('+')}>+</button>
	<button on:click={() => handleMathOpClick('-')}>−</button>
	<button on:click={() => handleMathOpClick('*')}>×</button>
	{#if cannotDivideReason}
		<button class="disabled" title={cannotDivideReason}>÷</button>
	{:else}
		<button on:click={() => handleMathOpClick('/')}>÷</button>
	{/if}
</div>

<style>
	div {
		display: flex;
		justify-content: space-around;
	}
	button {
		background: #e2e8f0;
		color: #64748b;
		border: unset;
		border-radius: 6px;
		padding: 0.75rem 1.5rem;
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
