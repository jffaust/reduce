<script lang="ts">
	import Tile from './Tile.svelte';
	import type { Board, Point2D } from '$lib/core/Common';
	import type { Selection } from '$lib/core/Selection';

	export let board: Board;
	export let tileSizePx: number;
	export let boardSizePx: number;
	export let boardOffsetPx: Point2D;
	export let selection: Selection;

	$: tableStyle = `width: ${boardSizePx}px; height: ${boardSizePx}px;`;
</script>

<table style={tableStyle}>
	{#each board as row, y (y)}
		<tr>
			{#each row as tileValue, x (x)}
				<Tile {boardOffsetPx} {tileSizePx} {selection} {tileValue} tileX={x} tileY={y} />
			{/each}
		</tr>
	{/each}
</table>

<style>
	table {
		margin: 0 auto;
		border-collapse: collapse;
	}
</style>
