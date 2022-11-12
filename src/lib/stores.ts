import { writable } from "svelte/store";
import type { Point2D } from '$lib/core/Common'

export const pointedTile = writable<Point2D | null>(null);