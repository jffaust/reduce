import Prando from "prando";
import { Utils } from "./Utils";
import { Selection } from "./Selection";
import type { Board, Direction, Move, Operation, Point2D, Solution, TileValue } from "./Common";

export class BoardGenerator {

    private seed;
    private rng: Prando;

    constructor(seed: number) {
        this.seed = seed;
        this.rng = new Prando(this.seed);
    }

    getSeed() { return this.seed; }

    private getRandomValidPosition(board: Board): Point2D {
        let allValidPositions: Point2D[] = [];

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {

                if (board[y][x] !== "X") {
                    allValidPositions.push({ x: x, y: y });
                }
            }
        }

        return this.rng.nextArrayItem(allValidPositions);
    }

    generate(maxGridSize: number, maxSelectionLength: number, availableOperations: Operation[], minTileValue: number, maxTileValue: number): [Board, Solution] {

        let solution: Solution = [];
        let gridSize = this.rng.nextInt(3, maxGridSize);
        let board: Board = Utils.CreateEmptyBoard<TileValue>(gridSize, gridSize, "X");
        let finalPosX = this.rng.nextInt(0, gridSize - 1);
        let finalPosy = this.rng.nextInt(0, gridSize - 1);
        board[finalPosy][finalPosX] = 1;

        while (!Utils.IsBoardFull(board)) {
            // 1. Get a random selection length
            let desiredLength = this.rng.nextInt(2, maxSelectionLength);

            let retry = true;
            let selection: Selection;
            let reduceOpTarget: Point2D;
            do {

                // 2. Create a random initial selection
                reduceOpTarget = this.getRandomValidPosition(board);
                selection = new Selection([reduceOpTarget]);

                // 4. Generate a random selection path
                retry = this.generateSelection(board, selection, desiredLength);
            } while (retry)

            // 5. The selected tile's value is the result of the reduce function
            const reduceOpResult = board[reduceOpTarget.y][reduceOpTarget.x];

            let selectionPath = selection.getPath();
            let randomTileValues: number[] = [];
            // 6. Generate the tile values that would be on the board before the reduce application
            for (let s = 0; s < selectionPath.length - 1; s++) {

                let n = this.rng.nextInt(minTileValue, maxTileValue);
                randomTileValues.push(n);
            }

            // 7. Get a random operation; the player will have to apply the reverse operator
            const op = Utils.GetRandomOperation();

            // 8. Prepare the reverse reduce application
            let reduceNumbers = [reduceOpResult as number].concat(randomTileValues);

            // 9. Calculate the last number that will make the reverse reduce application work
            let result: number | null = null;
            if (op === "+") {
                result = reduceNumbers.reduce((a, b) => a + b)
            } else if (op === "-") {
                result = reduceNumbers.reduce((a, b) => a - b)
            } else if (op === "*") {
                result = reduceNumbers.reduce((a, b) => a * b)
            } else if (op === "/") {
                //TODO: improve generation algo when divison operator is used to avoid the error cases
                if (reduceNumbers.includes(0)) {
                    continue;
                }
                result = reduceNumbers.reduce((a, b) => a / b)

                if (result % 1 !== 0) {
                    continue;
                }
            }

            if (result === null) { throw "Unable to produce a result while generating a board" }

            let newBoardValues = randomTileValues.concat([result]);

            // 10. Update the board with the new numbers
            for (let s = 0; s < selectionPath.length; s++) {
                let pos = selectionPath[s];
                let newNumber = newBoardValues[s];
                board[pos.y][pos.x] = newNumber;
            }

            // 11. Reverse the selection path and operator
            let reversedPath = selectionPath.slice().reverse();
            let reversedOp = Utils.GetInverseOperation(op);
            // @ts-ignore weird TS error with Selection from Svelte or something
            let move: Move = [new Selection(reversedPath), reversedOp];
            solution.push(move);
        }

        return [board, solution.reverse()];
    }

    //return value indicates whether it should be retried
    generateSelection(board: Board, selection: Selection, desiredLength: number): boolean {

        if (selection.getPath().length == 0) return true;

        while (selection.getPath().length < desiredLength) {

            let path = selection.getPath();
            let head = path[path.length - 1];
            let allowedDirections: Direction[] = ["up", "down", "left", "right"];
            let validDirections: Direction[] = ["up", "down", "left", "right"];

            // Remove walkback direction
            if (path.length > 1) {
                let penultimate = path[path.length - 2];
                let skipDir = Utils.GetDirection(head, penultimate);
                if (skipDir) {
                    let skipIdx = validDirections.indexOf(skipDir);
                    validDirections.splice(skipIdx, 1);
                }
            }

            // Only keep directions where we have an empty tile
            for (let d = 0; d < allowedDirections.length; d++) {
                let adjPos = Utils.GetNextPoint(head, allowedDirections[d]);
                if ((adjPos.y >= 0 && adjPos.y < board.length && adjPos.x >= 0 && adjPos.x < board[0].length && board[adjPos.y][adjPos.x] !== "X")
                    || adjPos.y < 0 || adjPos.y >= board.length || adjPos.x < 0 || adjPos.x >= board[0].length) {

                    let skipIdx = validDirections.indexOf(allowedDirections[d]);
                    validDirections.splice(skipIdx, 1);
                }
            }

            if (validDirections.length == 0) {
                break;
            }

            let nextDir = this.rng.nextArrayItem(validDirections);
            let nextPos = Utils.GetNextPoint(head, nextDir);

            selection.continue(nextPos);
        }

        if (selection.getPath().length < 2 || selection.getPath().length < desiredLength) {
            return true;
        } else { return false; }
    }
}