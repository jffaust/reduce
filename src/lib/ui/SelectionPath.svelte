<script lang="ts">
	import type { Point2D } from '$lib/core/Common';
	import type { Selection } from '$lib/core/Selection';
	import { Utils } from '$lib/core/Utils';

	export let tileSizePx: number;
	export let selection: Selection;

	type Line = { start: Point2D; end: Point2D };

	let connectors: Line[];

	$: connectors = computeConnectors(selection);

	function computeConnectors(sel: Selection) {
		let path = sel.getPath();
		let tmpConnetors: Line[] = [];

		for (let i = 0; i < path.length - 1; i++) {
			const current = path[i];
			const next = path[i + 1];
			const connector = getConnectorLine(current, next);
			if (connector) tmpConnetors.push(connector);
		}
		return tmpConnetors;
	}

	function getConnectorLine(current: Point2D, next: Point2D): Line | undefined {
		const nextDir = Utils.GetDirection(current, next);
		if (!nextDir) {
			return;
		}

		let cc = {
			// center of the current
			// 8 is the gap between tiles
			x: current.x * (tileSizePx + 8) + tileSizePx / 2 + 4,
			y: current.y * (tileSizePx + 8) + tileSizePx / 2
		};
		let ec = {
			// center of the next tile
			// 8 is the gap between tiles
			x: next.x * (tileSizePx + 8) + tileSizePx / 2 + 4,
			y: next.y * (tileSizePx + 8) + tileSizePx / 2
		};

		let start: Point2D;
		let end: Point2D;
		const offset = tileSizePx / 2.2;
		switch (nextDir) {
			case 'up':
				start = { x: cc.x, y: cc.y - offset };
				end = { x: ec.x, y: ec.y + offset };
				break;
			case 'down':
				start = { x: cc.x, y: cc.y + offset };
				end = { x: ec.x, y: ec.y - offset };
				break;
			case 'left':
				start = { x: cc.x - offset, y: cc.y };
				end = { x: ec.x + offset, y: ec.y };
				break;
			case 'right':
				start = { x: cc.x + offset, y: cc.y };
				end = { x: ec.x - offset, y: ec.y };
				break;
		}
		return { start, end };
	}
</script>

<svg>
	{#each connectors as line}
		<line
			x1={line.start.x}
			y1={line.start.y}
			x2={line.end.x}
			y2={line.end.y}
			stroke-width={tileSizePx / 10}
		/>
	{/each}
</svg>

<style>
	svg {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		/* pointer-events: none; */
		/* background-color: lightcoral; */
	}

	line {
		stroke: rgb(127, 157, 197) !important;
	}
</style>
