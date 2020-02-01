import { Point } from "./Point";

export interface Neighbour {
  pt1: Point;
  pt2: Point;
  distance: number;
}

export function newNeighbour(pt1: Point, pt2: Point, distance: number): Neighbour {
  if (pt1.id <= pt2.id) {
    return { pt1, pt2, distance };
  } else {
    return { pt1: pt2, pt2: pt1, distance };
  }
}