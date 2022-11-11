//Selection rules (extracted so can be reused by random level generation):
//-reset selection
//-continue selection (push)
//-walkback (pop)

// TODO: selection could technically be outside the board

import type { Point2D } from "./Common";

export class Selection {

    private path: Point2D[];

    constructor(path: Point2D[]) {
        this.path = path;
    }

    getPath(): Point2D[] {
        return this.path;
    }

    // returns true when selection has changed, false otherwise
    continue(point: Point2D): boolean {

        //for now, you can't cross over existing path
        if (!this.alreadyVisited(point)) {
            this.path.push(point);
            return true;
        } else if (this.path.length > 1
            && this.path[this.path.length - 2].x == point.x
            && this.path[this.path.length - 2].y == point.y) {
            // undo last position when point is the second to last
            this.path.pop();
            return true;
        }
        return false;
    }

    reset(point: Point2D) {
        this.path = [point];
    }

    alreadyVisited(point: Point2D): boolean {
        let found = false;
        for (let i = 0; i < this.path.length; i++) {
            if (point.x == this.path[i].x && point.y == this.path[i].y) {
                found = true;
            }
        }
        return found;
    }
}