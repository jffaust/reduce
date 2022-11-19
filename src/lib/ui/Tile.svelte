<script lang="ts">
	import { onMount } from 'svelte';
	import type { Selection } from '$lib/core/Selection';
	import type { TileValue } from '$lib/core/Common';
	import { pointedTile } from '$lib/stores';
	import { Utils } from '$lib/core/Utils';

	export let tileX: number;
	export let tileY: number;
	export let tileSizePx: number;
	export let selection: Selection;
	export let tileValue: TileValue;

	let cellStyle = '';
	let cell: HTMLDivElement;

	$: {
		refreshLayout(tileSizePx, selection);
	}

	onMount(() => {
		refreshLayout(tileSizePx, selection);
	});

	$: textStyle = `font-size: ${tileSizePx * 0.3}px;`;
	$: tileClass = getTileClass(selection);

	function getTileClass(sel: Selection) {
		if (tileValue == 'X') {
			return 'used';
		}

		let path = sel.getPath();
		for (let i = 0; i < path.length; i++) {
			const pos = path[i];
			if (pos.x == tileX && pos.y == tileY) {
				let tileClass = 'selected';

				if (i === path.length - 1) {
					tileClass += ' head';
				}

				const prev = i - 1;
				if (prev >= 0) {
					const prevPos = path[prev];
					const prevDir = Utils.GetDirection(pos, prevPos);
					tileClass += ` ${prevDir}`;
				}

				const next = i + 1;
				if (next < path.length) {
					const nextPos = path[next];
					const nextDir = Utils.GetDirection(pos, nextPos);
					tileClass += ` ${nextDir}`;
				}

				return tileClass;
			}
		}
		return '';
	}

	function refreshLayout(tileSize: number, sel: Selection) {
		cellStyle = `width: ${tileSize}px; height: ${tileSize}px;`;
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

<td
	bind:this={cell}
	class={tileClass}
	style={cellStyle}
	on:pointerenter={onPointerEnter}
	on:pointerleave={onPointerLeave}
>
	{#if tileValue != 'X'}
		<p style={textStyle}>{tileValue}</p>
	{/if}
</td>

<style>
	td {
		border: 3px solid #7e8a9c;
		user-select: none;
		background: #e2e8f0;
		color: #475569;
		box-sizing: border-box;
	}

	td:hover {
		background: #cbd5e1;
		color: #475569;
		cursor: pointer;
	}

	.used {
		cursor: default !important;
		background-color: rgb(237, 237, 241) !important;
		transition: background-color 0.5s ease;
	}
	.selected {
		background-color: lightsteelblue !important;
		transition: background-color 0.5s ease;
	}
	.selected.head {
		background-color: lightskyblue !important;
		transition: background-color 0.5s ease;
	}

	td.selected.left {
		border-left-style: dashed;
		border-left-width: 1px;
	}
	td.selected.right {
		border-right-style: dashed;
		border-right-width: 1px;
	}
	td.selected.up {
		border-top-style: dashed;
		border-top-width: 1px;
	}
	td.selected.down {
		border-bottom-style: dashed;
		border-bottom-width: 1px;
	}
</style>
