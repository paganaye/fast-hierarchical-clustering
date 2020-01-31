import { QuadTree } from "./QuadTree";
import { QuadNode, QuadSector } from "./QuadNode";
import { Enumerable } from "./enumerable";

export class EnumerableQuad implements Enumerable<QuadNode>{
  private currentPath: QuadNode[] = []

  getFirst(): QuadNode | null {
    this.currentPath = [];
    return this.getNorthWesterest(this.quadTree.root);
  }

  private getNorthWesterest(current: QuadNode): QuadNode | null {
    while (current != null) {
      this.currentPath.push(current);
      let nextNode = current.nw || current.ne || current.sw || current.se;
      if (nextNode == null) {
        return current;
      }
      else current = nextNode;
    }
    return null
  }

  getNext(): QuadNode | null {
    while (true) {
      let previous = this.currentPath.pop();
      if (previous == null || this.currentPath.length == 0) return null;
      var current: QuadNode | undefined = this.currentPath[this.currentPath.length - 1];
      switch (previous.sector) {
        case QuadSector.NorthWest:
          current = current.ne || current.sw || current.se;
          break;
        case QuadSector.NorthEast:
          current = current.sw || current.se;
          break;
        case QuadSector.SouthWest:
          current = current.se;
          break;
        default:
          current = undefined;
          break;
      }
      if (current != null) {
        return this.getNorthWesterest(current);
      }
    }
    return null;
  }

  constructor(private quadTree: QuadTree) { }
}

