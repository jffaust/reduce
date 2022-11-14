<script lang="ts">
	import Tile from './Tile.svelte';
	import type { Board, Point2D } from '$lib/core/Common';
	import type { Selection } from '$lib/core/Selection';
	import SelectionPath from './SelectionPath.svelte';

	export let board: Board;
	export let tileSizePx: number;
	export let selection: Selection;

	$: tableStyle = ''; //`width: ${boardSizePx}px; height: ${boardSizePx}px;`;
</script>

<div class="board" style={tableStyle}>
	<SelectionPath {selection} {tileSizePx} />
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
		width: fit-content;
		position: relative;
		/* border-collapse: collapse; */
	}

	.row {
		margin: 4px 0;
	}
</style>
