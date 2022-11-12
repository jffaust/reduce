<script lang="ts">
	import Tile from './Tile.svelte';
	import type { Board, Point2D } from '$lib/core/Common';
	import type { Selection } from '$lib/core/Selection';

	export let board: Board;
	export let tileSizePx: number;
	export let boardOffsetPx: Point2D;
	export let selection: Selection;

	$: tableStyle = ''; //`width: ${boardSizePx}px; height: ${boardSizePx}px;`;
</script>

<div class="board" style={tableStyle}>
	{#each board as row, y (y)}
		<div class="row">
			{#each row as tileValue, x (x)}
				<Tile {tileSizePx} {selection} {tileValue} tileX={x} tileY={y} />
			{/each}
		</div>
	{/each}
</div>

<style>
	.board {
		margin: 0 auto;
		/* border-collapse: collapse; */
	}

	.row {
		margin: 8px 0;
	}
</style>
