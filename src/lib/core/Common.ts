export type TileValue = "X" | number;
export type Direction = "up" | "down" | "left" | "right";
export type Operation = "+" | "-" | "*" | "/";
export type Board = TileValue[][];
export type Move = [Selection, Operation];
export type Solution = Move[];

export interface Point2D {
    x: number;
    y: number;
}

export enum ReduceErrorReason {
    InvalidSelection, // If it contains empty tiles
    DivideByZero,
    ResultIsDecimal
}