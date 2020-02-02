import { Point } from "./Point";
import { QuadNode } from "./QuadNode";
import { Dendrogram } from "./Dendrogram";

export interface Neighbour {
  pt1: Dendrogram;
  pt2: Dendrogram;
  distance: number;
  n1?: QuadNode;
  n2?: QuadNode;
}

export function newNeighbour(pt1: Dendrogram, pt2: Dendrogram, distance: number, n1?: QuadNode, n2?: QuadNode): Neighbour {
  if (pt1.id <= pt2.id) {
    return { pt1, pt2, distance, n1, n2 };
  } else {
    return { pt1: pt2, pt2: pt1, distance, n1: n2, n2: n1 };
  }
}