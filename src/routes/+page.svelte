<script lang="ts">
	import GameBoard from '$lib/ui/Board.svelte';
	import MathOperators from '$lib/ui/MathOperators.svelte';
	import { BoardGenerator } from '$lib/core/BoardGenerator';
	import { type Board, type Point2D, type Operation, ReduceErrorReason } from '$lib/core/Common';
	import { Selection } from '$lib/core/Selection';
	import { Utils } from '$lib/core/Utils';
	import { Game } from '$lib/core/Game';

	let dragging = false;
	let previousPointerDragPos: Point2D | null = null;

	let tileSizePx: number;
	let boardSizePx: number;
	let boardOffsetPx: Point2D;

	let game: Game;
	let board: Board;
	let selection: Selection;
	let cannotDivideReason = '';
	let boardGenerator = new BoardGenerator(Date.now());

	newRandomLevel();

	function newRandomLevel() {
		game = new Game(boardGenerator.generate(5, 4, ['+', '-'], 0, 4)[0]);
		refreshBoard();
		refreshLayout();
	}

	function handleKeyUp(event: KeyboardEvent) {
		let dir = Utils.GetDirectionFromEventKey(event.key);

		if (dir) {
			if (game.getCurrentSelection().getPath().length == 0) {
				let tile = Utils.GetFirstValidPosition(game.getCurrentBoard());
				if (tile) {
					game.setSelection(new Selection([{ x: tile.x, y: tile.y }]));
					onSelectionUpdated();
				}
			} else {
				let reset = true;
				if (event.getModifierState('Shift')) {
					reset = false;
				}
				let selectionUpdated = game.updateSelection(dir, reset);
				if (selectionUpdated) {
					onSelectionUpdated();
				}
			}
		} else if (event.key == '-' || event.key == '+' || event.key == '*' || event.key == '/') {
			game.reduceSelection(event.key);
			//TODO: error handling
			refreshBoard();
		} else if (event.key == 'z' && event.getModifierState('Control')) {
			game.popState();
			refreshBoard();
		}
	}

	function handleMathOpClick(op: Operation) {
		//TODO: error handling
		game.reduceSelection(op);
		refreshBoard();
	}

	function refreshBoard() {
		// after we update the selection, we need to re-assign the board
		// because the selection doesn't have its own markup (style change)
		selection = game.getCurrentSelection();
		board = game.getCurrentBoard();
	}

	function refreshLayout() {
		let maxWidth = window.innerWidth * 0.8;
		let maxHeight = window.innerHeight * 0.6;

		let projectedBoardSizePx = maxWidth;
		//we want the board to be either 80% of the width or 60% of the height
		if (maxHeight < maxWidth) {
			projectedBoardSizePx = maxHeight;
		}

		boardSizePx = Math.floor(projectedBoardSizePx);

		//square grids so we can just check the first array's length
		let boardTileHeight = board.length;
		tileSizePx = Math.floor(boardSizePx / boardTileHeight);

		let boardCenter = {
			x: boardSizePx / 2,
			y: boardSizePx / 2
		};

		let windowCenter = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};

		boardOffsetPx = Utils.Difference(windowCenter, boardCenter);
	}

	function handlePointerMove(e: PointerEvent) {
		if (dragging) {
			let tilePos = Utils.getBoardPositionFromPointer(
				boardOffsetPx,
				board,
				tileSizePx,
				e.clientX,
				e.clientY
			);

			if (tilePos) {
				if (previousPointerDragPos == undefined) {
					// We start dragging on tiles
					previousPointerDragPos = Object.assign({}, tilePos);

					// Are we outside the current selection head?
					let selPath = game.getCurrentSelection().getPath();
					if (
						selPath.length == 0 ||
						tilePos.x != selPath[selPath.length - 1].x ||
						tilePos.y != selPath[selPath.length - 1].y
					) {
						// We reset the selection
						game.setSelection(new Selection([tilePos]));
						onSelectionUpdated();
					}
				} else if (
					(tilePos.x == previousPointerDragPos.x + 1 && tilePos.y == previousPointerDragPos.y) ||
					(tilePos.x == previousPointerDragPos.x - 1 && tilePos.y == previousPointerDragPos.y) ||
					(tilePos.x == previousPointerDragPos.x && tilePos.y == previousPointerDragPos.y + 1) ||
					(tilePos.x == previousPointerDragPos.x && tilePos.y == previousPointerDragPos.y - 1)
				) {
					let dir = Utils.GetDirection(previousPointerDragPos, tilePos);
					if (dir) {
						let selectionUpdated = game.updateSelection(dir, false);
						if (selectionUpdated) {
							previousPointerDragPos = Object.assign({}, tilePos);
							onSelectionUpdated();
						}
					}
				}
			}
		}
	}

	function onSelectionUpdated() {
		const result = game.getReduceResult('/');
		if (result.err) {
			if (result.val == ReduceErrorReason.DivideByZero) {
				cannotDivideReason = 'Cannot divide by 0';
			} else if (result.val == ReduceErrorReason.ResultIsDecimal) {
				cannotDivideReason = 'Resulting number would be decimal';
			}
		} else {
			cannotDivideReason = '';
		}

		refreshBoard();
		//UpdateMathHints();
	}

	function handlePointerDown(e: PointerEvent) {
		if (e.button == 0) {
			dragging = true;
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (e.button == 0) {
			dragging = false;
			previousPointerDragPos = null;
		}
	}
</script>

<svelte:window
	on:keyup={handleKeyUp}
	on:resize={refreshLayout}
	on:pointermove={handlePointerMove}
	on:pointerdown={handlePointerDown}
	on:pointerup={handlePointerUp}
/>

<main>
	<h1 on:click={newRandomLevel}>REDUCE</h1>
	<GameBoard {boardOffsetPx} {board} {selection} {boardSizePx} {tileSizePx} />
	<MathOperators {boardOffsetPx} {boardSizePx} {handleMathOpClick} {cannotDivideReason} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		touch-action: none;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
		user-select: none;
	}

	h1:hover {
		cursor: pointer;
	}
</style>