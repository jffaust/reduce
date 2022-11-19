<script lang="ts">
	import Tile from './Tile.svelte';
	import type { Board, Point2D } from '$lib/core/Common';
	import type { Selection } from '$lib/core/Selection';

	export let board: Board;
	export let tileSizePx: number;
	export let selection: Selection;

	$: rowStyle = `height: ${tileSizePx}px;`; //`width: ${boardSizePx}px; height: ${boardSizePx}px;`;
</script>

<table class="board">
	{#each board as row, y (y)}
		<tr>
			{#each row as tileValue, x (x)}
				<Tile {tileSizePx} {selection} {tileValue} tileX={x} tileY={y} />
			{/each}
		</tr>
	{/each}
</table>

<style>
	.board {
		margin: 0 auto;
		width: fit-content;
		position: relative;
		border-collapse: collapse;
	}
</style>
