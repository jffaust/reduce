import { Result, Err, Ok } from 'ts-results';
import { Utils } from "./Utils";
import { Selection } from "./Selection";
import { ReduceErrorReason, type Board, type Direction, type Operation, type TileValue } from "./Common";

//Game logic and features:
//-what is considered a board cleared/completed (one tile with value of 1)
//-undo board state and selection
//-allowed operations (cannot divide by 0, cannot have float as result)
export class Game {

    private BoardCleared: boolean = false;
    private SelectionQueue: Selection[];
    private BoardStateQueue: Board[];

    constructor(board: Board) {
        this.BoardStateQueue = [board];
        this.SelectionQueue = [new Selection([])];
    }

    isBoardCleared(): boolean {
        return this.BoardCleared;
    }

    getMoveCount(): number {
        return this.BoardStateQueue.length - 1;
    }

    getCurrentBoard(copy: boolean = false): Board {
        let board = this.BoardStateQueue[this.BoardStateQueue.length - 1];
        if (copy) {
            //check if we can skip the .map and just do Object.assign
            return board.map(row => row.map(tv =>
                tv == "X" ? "X" : tv
            ));
        }
        else {
            return board;
        }
    }

    getCurrentSelection(): Selection {
        return this.SelectionQueue[this.SelectionQueue.length - 1];
    }

    popState() {
        if (!this.BoardCleared && this.BoardStateQueue.length > 1) {
            this.BoardStateQueue.pop();
            this.SelectionQueue.pop();
        }
    }

    private pushState(updatedBoard: Board, updatedSelection: Selection): boolean {
        if (this.BoardCleared) { return true; }

        this.BoardStateQueue.push(updatedBoard);
        this.SelectionQueue.push(updatedSelection);

        let total = 0;
        let remainingTileCount = 0;
        for (let y = 0; y < updatedBoard.length; y++) {
            let row: TileValue[] = updatedBoard[y];
            for (let x = 0; x < Object.keys(row).length; x++) {
                let tileValue = row[x];
                if (tileValue !== "X") {
                    total = total + tileValue;
                    remainingTileCount = remainingTileCount + 1;
                }
            }
        }
        if (remainingTileCount === 1 && total === 1) {
            this.BoardCleared = true;
        }

        return this.BoardCleared;
    }

    setSelection(selection: Selection) {
        this.SelectionQueue[this.SelectionQueue.length - 1] = selection;
    }

    //TODO: changeSelection(point: Point) for clicking on a new tile
    updateSelection(dir: Direction, reset: boolean): boolean {
        if (this.BoardCleared) { return true; }

        let board = this.getCurrentBoard();
        let sel = this.getCurrentSelection();
        let path = sel.getPath();
        let head = path[path.length - 1];
        let nextPos = Utils.GetNextPoint(head, dir);

        if (Utils.IsValidPosition(board, nextPos)) {

            if (reset) {
                sel.reset(nextPos);
                return true;
            } else {
                return sel.continue(nextPos);
            }
        }
        return false;
    }

    getReduceResult(op: Operation): Result<number, ReduceErrorReason> {
        let sel = this.getCurrentSelection().getPath();

        let numbers: number[] = [];
        let board = this.getCurrentBoard();

        for (let i = 0; i < sel.length; i++) {
            let tv: TileValue = board[sel[i].y][sel[i].x];

            if (tv === "X") {
                return Err(ReduceErrorReason.InvalidSelection)
            }
            else {
                numbers.push(tv)
            }
        }

        switch (op) {
            case "+": return Ok(numbers.reduce((a, b) => a + b));
            case "-": return Ok(numbers.reduce((a, b) => a - b));
            case "*": return Ok(numbers.reduce((a, b) => a * b));
            case "/":
                if (numbers.includes(0)) {
                    return Err(ReduceErrorReason.DivideByZero)
                }
                const result = numbers.reduce((a, b) => a / b)

                if (result % 1 !== 0) {
                    return Err(ReduceErrorReason.ResultIsDecimal)
                }

                return Ok(result);
        }
    }

    reduceSelection(op: Operation): Result<boolean, ReduceErrorReason> {
        let path = this.getCurrentSelection().getPath();
        if (this.BoardCleared) { return Ok(true); }
        if (path.length < 1) { return Err(ReduceErrorReason.InvalidSelection) }

        let result = this.getReduceResult(op);
        if (result.ok) {
            let board = this.getCurrentBoard(true);
            for (let i = 0; i < path.length; i++) {
                if (i !== path.length - 1) {
                    board[path[i].y][path[i].x] = "X";
                }
                else {
                    board[path[i].y][path[i].x] = result.val;
                }
            }
            let head = path[path.length - 1];
            let newSel = new Selection([head]);
            return Ok(this.pushState(board, newSel));
        } else {
            return Err(result.val);
        }
    }
}