<script lang="ts">
	import { onMount } from 'svelte';
	import { Utils } from '$lib/core/Utils';
	import type { Selection } from '$lib/core/Selection';
	import type { Direction, Point2D, TileValue } from '$lib/core/Common';
	import { pointedTile } from '$lib/stores';

	export let tileX: number;
	export let tileY: number;
	export let tileSizePx: number;
	export let boardOffsetPx: Point2D;
	export let selection: Selection;
	export let tileValue: TileValue;

	type Line = { start: Point2D; end: Point2D };

	let svgStyle = '';
	let cellStyle = '';
	let selected = false;
	let cellRect: DOMRect;
	let cell: HTMLDivElement;
	let selectionCircleRadius: number;
	let selectionCircleStrokeWidth: number;
	let connectors: Line[];
	const lineStyle = '';

	$: {
		refreshLayout(boardOffsetPx, tileSizePx, selection);
	}

	onMount(() => {
		refreshLayout(boardOffsetPx, tileSizePx, selection);
	});

	$: tileClass = getTileClass(selection);
	$: connectors = computeConnectors(selection);

	function computeConnectors(sel: Selection) {
		if (tileValue == 'X') return [];

		let tmpConnetors: Line[] = [];
		let path = sel.getPath();
		// could refactor to rely on a precalculated selection index
		// to avoid looping on the selection more than once
		for (let i = 0; i < path.length; i++) {
			const pos = path[i];
			if (pos.x == tileX && pos.y == tileY) {
				const prev = i - 1;
				if (prev >= 0) {
					const prevPos = path[prev];
					const prevDir = Utils.GetDirection(pos, prevPos);
					if (prevDir) tmpConnetors.push(getConnectorLine(prevDir));
				}

				const next = i + 1;
				if (next < path.length) {
					const nextPos = path[next];
					const nextDir = Utils.GetDirection(pos, nextPos);
					if (nextDir) tmpConnetors.push(getConnectorLine(nextDir));
				}
				break;
			}
		}
		return tmpConnetors;
	}

	function getTileClass(sel: Selection) {
		if (tileValue == 'X') {
			selected = false;
			return 'used';
		}

		let path = sel.getPath();
		for (let i = 0; i < path.length; i++) {
			const pos = path[i];
			if (pos.x == tileX && pos.y == tileY) {
				selected = true;
				let tileClass = 'selected';

				selectionCircleStrokeWidth = 2;
				if (i == path.length - 1) {
					selectionCircleStrokeWidth = 5;
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
		selected = false;
		return '';
	}

	function getConnectorLine(dir: Direction): Line {
		switch (dir) {
			case 'up':
				return {
					start: {
						x: cellRect.width / 2,
						y: cellRect.height / 2 - selectionCircleRadius
					},
					end: { x: cellRect.width / 2, y: 0 }
				};
			case 'down':
				return {
					start: {
						x: cellRect.width / 2,
						y: cellRect.height / 2 + selectionCircleRadius
					},
					end: { x: cellRect.width / 2, y: cellRect.height }
				};
			case 'left':
				return {
					start: {
						x: cellRect.width / 2 - selectionCircleRadius,
						y: cellRect.height / 2
					},
					end: { x: 0 / 2, y: cellRect.height / 2 }
				};
			case 'right':
				return {
					start: {
						x: cellRect.width / 2 + selectionCircleRadius,
						y: cellRect.height / 2
					},
					end: { x: cellRect.width, y: cellRect.height / 2 }
				};
		}
	}

	function refreshLayout(boardOffset: Point2D, tileSize: number, sel: Selection) {
		selectionCircleRadius = tileSize / 4;
		cellStyle = `width: ${tileSize}px; height: ${tileSize}px;`;
		if (cell) {
			cellRect = cell.getBoundingClientRect();
			svgStyle = `top: ${cellRect.y}px; left: ${cellRect.x}px; position: fixed;`;
			svgStyle += `width: ${cellRect.width}px; height: ${cellRect.height}px;`;
		}
		connectors = computeConnectors(selection);
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
	bind:this={cell}
	class={tileClass}
	style={cellStyle}
	on:pointerenter={onPointerEnter}
	on:pointerleave={onPointerLeave}
>
	{#if tileValue != 'X'}
		<p>{tileValue}</p>
	{/if}
</div>

<style>
	div {
		display: inline-block;
		font-size: xxx-large;
		border-radius: 4px;
		user-select: none;
		background: #e2e8f0;
		color: #64748b;
		margin: 0 8px;
		position: relative;
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
	div:focus {
		background: #94a3b8;
		color: #f1f5f9;
	}

	.used {
		visibility: hidden;
		/* background-color: lightgrey;
		transition: background-color 0.5s ease; */
	}
	.selected {
		background-color: rgb(200, 200, 241) !important;
		transition: background-color 0.5s ease;
	}
	.selected.left {
		border-left-style: none;
	}
	.selected.right {
		border-right-style: none;
	}
	.selected.up {
		border-top-style: none;
	}
	.selected.down {
		border-bottom-style: none;
	}
</style>
