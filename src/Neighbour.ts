import { QuadNode } from "./QuadNode";
import { Point } from "./Point";
import { LogLevel, Log } from "./Log";
import { twoDec, threeDec } from "./Utils";

export interface Neighbour {
  pt1: Point;
  pt2: Point;
  distance: number;
  n1?: QuadNode;
  n2?: QuadNode;
}

export function logNeighbours(level: LogLevel, title: string, neighbours?: Neighbour[]) {
  if (neighbours && Log.willLog(level)) {
    Log.writeLine(level, title);
    for (var neighbour of neighbours) {
      Log.writeLine(level, neighbourToString(neighbour));
    }
  }
}

export function neighbourToString(neighbour?: Neighbour) {
  if (!neighbour) return "null";
  return threeDec(neighbour.distance) + " " + neighbour.pt1.id + "-" + neighbour.pt2.id;
}

export function newNeighbour(pt1: Point, pt2: Point, distance: number, n1?: QuadNode, n2?: QuadNode): Neighbour {
  if (pt1.id <= pt2.id) {
    return { pt1, pt2, distance, n1, n2 };
  } else {
    return { pt1: pt2, pt2: pt1, distance, n1: n2, n2: n1 };
  }
}