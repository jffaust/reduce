<script lang="ts">
	import { onMount } from 'svelte';
	import type { Selection } from '$lib/core/Selection';
	import type { TileValue } from '$lib/core/Common';
	import { pointedTile } from '$lib/stores';
	import { interpolateRgb } from 'd3-interpolate';

	export let tileX: number;
	export let tileY: number;
	export let tileSizePx: number;
	export let selection: Selection;
	export let tileValue: TileValue;

	let tileBG = '';
	let tileStyle = '';
	let tileClass = '';
	let textStyle = '';

	const interpolate = interpolateRgb('lightsteelblue', 'mediumaquamarine');

	$: calcTileStyle(selection);
	$: refreshLayout(tileSizePx);

	onMount(() => {
		refreshLayout(tileSizePx);
	});

	function calcTileStyle(sel: Selection) {
		if (tileValue == 'X') {
			tileClass = 'used';
		}

		tileBG = '';
		let path = sel.getPath();
		for (let i = 0; i < path.length; i++) {
			const pos = path[i];
			if (pos.x == tileX && pos.y == tileY) {
				tileClass = 'selected';
				// boards can have a total of 25 tiles
				tileBG = interpolate(i / 9);
			}
		}

		// if (tileClass != 'selected') {
		// 	tileBG = ''
		// }
	}

	function refreshLayout(tileSize: number) {
		textStyle = `font-size: ${tileSizePx * 0.3}px;`;
		tileStyle = `width: ${tileSize}px; height: ${tileSize}px;`;
	}

	function onPointerEnter() {
		if (tileValue != 'X') {
			$pointedTile = {
				x: tileX,
				y: tileY
			};
		}
	}

	function onPointerLeave() {
		$pointedTile = null;
	}
</script>

<div
	style={tileStyle}
	style:background={tileBG}
	class={tileClass}
	on:pointerenter={onPointerEnter}
	on:pointerleave={onPointerLeave}
>
	{#if tileValue != 'X'}
		<p style={textStyle}>{tileValue}</p>
	{/if}
</div>

<style>
	div {
		display: inline-block;
		border-radius: 4px;
		user-select: none;
		background: #e2e8f0;
		color: #64748b;
		margin: 0 4px;
		position: relative;
		cursor: pointer;
	}

	div p {
		position: absolute;
		margin: 0;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	div:hover {
		background: #cbd5e1;
		color: #475569;
	}

	.used {
		/* visibility: hidden; */
		background-color: rgb(245, 245, 245) !important;
		transition: background-color 0.5s ease;
	}
	.selected {
		/* background-color: lightsteelblue !important; */
		transition: background-color 0.5s ease;
	}
</style>
