import type { Board, Direction, Operation, Point2D, TileValue } from "./Common";

export class Utils {

    // Gets the first position that is not "X"
    static GetFirstValidPosition(board: Board): Point2D | undefined {
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x] != "X") {
                    return { x: x, y: y };
                }
            }
        }
        return undefined;
    }

    static CreateEmptyBoard<T>(width: number, height: number, defaultValue: T): T[][] {
        let newBoard: T[][] = [];
        for (let y = 0; y < height; y++) {

            let row: T[] = [];
            for (let x = 0; x < width; x++) {
                row.push(defaultValue);
            }
            newBoard.push(row);
        }
        return newBoard;
    }

    // Used for board generation. Returns true when the board is full of numbers
    // and there are no remaining tiles with "X"
    static IsBoardFull(board: Board): boolean {
        for (let y = 0; y < board.length; y++) {

            let row: TileValue[] = board[y];
            for (let x = 0; x < Object.keys(row).length; x++) {
                let tileValue = row[x];

                if (tileValue === "X") {
                    return false;
                }
            }
        }
        return true;
    }

    static Difference(a: Point2D, b: Point2D): Point2D {
        return { x: a.x - b.x, y: a.y - b.y };
    }

    static Dot(u: Point2D, v: Point2D) {
        return u.x * v.x + u.y * v.y;
    }

    //https://codepen.io/JohannesB/pen/JjXqZJr
    // |-----------------------------------------------------------------
    // |----------B------------------------------------------------------
    // |----------**-----------------------------------------------------
    // |---------*****---------------------------------------------------
    // |---------*******-------------------------------------------------
    // |--------**********-----------------------------------------------
    // |--------************---------------------------------------------
    // |-------***************-------------------------------------------
    // |-------*****************-----------------------------------------
    // |------********************---------------------------------------
    // |------*********************--------------------------------------
    // |-----************************------------------------------------
    // |-----**************************----------------------------------
    // |----*****************************--------------------------------
    // |----*******************************------------------------------
    // |---**********************************----------------------------
    // |--A************************************--------------------------
    // |----************************************C------------------------
    // |------**********************************-------------------------
    // |--------*******************************--------------------------
    // |----------*****************************--------------------------
    // |------------**************************---------------------------
    // |--------------************************---------------------------
    // |----------------*********************----------------------------
    // |-----------------********************----------------------------
    // |-------------------*****************-----------------------------
    // |---------------------***************-----------------------------
    // |-----------------------************------------------------------
    // |-------------------------**********------------------------------
    // |---------------------------*******-------------------------------
    // |-----------------------------*****-------------------------------
    // |-------------------------------**--------------------------------
    // |--------------------------------D--------------------------------
    static IsPointInRectangle(m: Point2D, a: Point2D, b: Point2D, c: Point2D, d: Point2D): boolean {
        let AB = Utils.Difference(b, a);
        let AD = Utils.Difference(d, a);
        let AM = Utils.Difference(m, a);
        let dotAMAB = Utils.Dot(AM, AB);
        let dotABAB = Utils.Dot(AB, AB);
        let dotAMAD = Utils.Dot(AM, AD);
        let dotADAD = Utils.Dot(AD, AD);

        return 0 <= dotAMAB && dotAMAB <= dotABAB && 0 <= dotAMAD && dotAMAD <= dotADAD;
    }

    static GetDirection(a: Point2D, b: Point2D): Direction | undefined {
        let diffX = b.x - a.x;
        let diffY = b.y - a.y;

        if (diffX > 0) { return "right" }
        else if (diffX < 0) { return "left" }
        else if (diffY > 0) { return "down" }
        else if (diffY < 0) { return "up" }

        return undefined;
    }

    static GetRandomDirection(skip?: Direction): Direction {
        let allowedDirections: Direction[] = ["up", "down", "left", "right"];

        if (skip != undefined) {
            let skipIdx = allowedDirections.indexOf(skip);
            allowedDirections.splice(skipIdx, 1);
        }

        let resultIdx = Math.floor(Math.random() * 3) + 1;
        return allowedDirections[resultIdx];
    }

    static GetDirectionFromEventKey(key: string): Direction | undefined {
        if (key == "ArrowRight") { return "right" }
        else if (key == "ArrowLeft") { return "left" }
        else if (key == "ArrowDown") { return "down" }
        else if (key == "ArrowUp") { return "up" }
    }

    static GetRandomOperation(): Operation {
        //TODO: add multiplication and division
        let allowedOps: Operation[] = ["+", "-"];//, "*", "/"];

        let resultIdx = Math.floor(Math.random() * allowedOps.length - 1) + 1;
        return allowedOps[resultIdx];
    }

    static GetInverseOperation(op: Operation): Operation {
        switch (op) {
            case "+": return "-";
            case "-": return "+";
            case "*": return "/";
            case "/": return "*";
        }
    }

    // Similar to a web page, 0,0 refers to the top left corner
    static GetNextPoint(current: Point2D, dir: Direction): Point2D {
        switch (dir) {
            case "up":
                return { x: current.x, y: current.y - 1 };
            case "down":
                return { x: current.x, y: current.y + 1 };
            case "left":
                return { x: current.x - 1, y: current.y };
            case "right":
                return { x: current.x + 1, y: current.y };
        }
    }

    static IsValidPosition(board: Board, pos: Point2D) {
        if (pos.y < 0 || pos.y >= board.length || pos.x < 0 || pos.x >= board[pos.y].length || board[pos.y][pos.x] === "X") {
            return false;
        }
        return true;
    }

    // Returned Point is a tile position in the board 2d array
    static getBoardPositionFromPointer(boardOffset: Point2D, board: Board, tileSizePx: number, mx: number, my: number): Point2D | undefined {

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                let tileValue = board[y][x];

                if (tileValue !== "X") {
                    let tileTopLeftCorner: Point2D = {
                        x: x * tileSizePx + boardOffset.x,
                        y: y * tileSizePx + boardOffset.y,
                    };

                    if (
                        mx > tileTopLeftCorner.x &&
                        mx < tileTopLeftCorner.x + tileSizePx &&
                        my > tileTopLeftCorner.y &&
                        my < tileTopLeftCorner.y + tileSizePx
                    ) {
                        return { x: x, y: y };
                    }
                }
            }
        }
        return undefined;
    }
}