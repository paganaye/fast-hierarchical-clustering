import { QuadNode, QuadSector } from "./QuadNode";
import { Point } from "./Point";

export interface QuadTreeConfig {
  nodeSize: number
}

export class QuadTree {
  root: QuadNode;
  nodeSize: number;

  constructor(config: QuadTreeConfig) {
    this.nodeSize = config.nodeSize;

    this.root = new QuadNode({
      quadTree: this,
      xmin: 0,
      ymin: 0,
      size: this.nodeSize,
      sector: QuadSector.Root
    });
  }

  add(point: Point) {
    // if (point.id==50) debugger;
    var node = this.root;
    while (node != null) {
      if (point.x >= node.xmin && point.x < node.xmax
        && point.y >= node.ymin && point.y < node.ymax) {
        // we're in
        if (node.isLeaf) {
          node.addPoint(point);
          // and we're done
          break;
        } else {
          let isWest = point.x < node.xmid;
          let isNorth = point.y < node.ymid;
          node = node.getOrCreateChild(isWest, isNorth);
        }
      } else {
        if (node.sector !== QuadSector.Root) {
          debugger;
        }
        // we're out
        let pointIsWest = point.x < node.xmin;
        let pointIsNorth = point.y < node.ymin;
        let newSector = QuadNode.getSector(!pointIsWest, !pointIsNorth);
        let xmin = pointIsWest ? node.xmin - node.size : node.xmin;
        let ymin = pointIsNorth ? node.ymin - node.size : node.ymin;

        this.root = new QuadNode({
          quadTree: this,
          sector: QuadSector.Root,
          xmin,
          ymin,
          size: node.size * 2,
        });
        if (!node.isEmpty()) {
          this.root.attachChildNode(newSector, node);
        }
        node = this.root;
      }
    }
  }

  static getSouthEastNeighbour(current: QuadNode | undefined): QuadNode | undefined {
    let parent = current?.parentNode;
    if (!parent) return undefined;
    switch (current?.sector) {
      case QuadSector.NorthWest:
        return parent.se;
      case QuadSector.NorthEast:
        var neighbour = this.getEastNeighbour(parent);
        return neighbour?.sw;
      case QuadSector.SouthWest:
        var neighbour = this.getSouthNeighbour(parent);
        return neighbour?.ne;
      case QuadSector.SouthEast:
        var neighbour = this.getSouthEastNeighbour(parent);
        return neighbour?.nw;
      default:
        throw "Internal error";
    }
  }

  static getSouthWestNeighbour(current: QuadNode | undefined): QuadNode | undefined {
    let parent = current?.parentNode;
    if (!parent) return undefined;
    switch (current?.sector) {
      case QuadSector.NorthWest: // 1
        var neighbour = this.getWestNeighbour(parent);
        return neighbour?.se;
      case QuadSector.NorthEast: // 2
        return parent.sw;
      case QuadSector.SouthWest: // 3
        var neighbour = this.getSouthWestNeighbour(parent);
        return neighbour?.ne;
      case QuadSector.SouthEast: // 4
        var neighbour = this.getSouthNeighbour(parent);
        return neighbour?.nw;
      default:
        throw "Internal error";
    }
  }

  static getSouthNeighbour(current: QuadNode | undefined): QuadNode | undefined {
    let parent = current?.parentNode;
    if (!parent) return undefined;
    switch (current?.sector) {
      case QuadSector.NorthWest: // 1
        return parent.sw;
      case QuadSector.NorthEast: // 2
        return parent.se;
      case QuadSector.SouthWest: // 3
        var neighbour = this.getSouthNeighbour(parent);
        return neighbour?.nw;
      case QuadSector.SouthEast: // 4
        var neighbour = this.getSouthNeighbour(parent);
        return neighbour?.ne;
      default:
        throw "Internal error";
    }
  }

  static getEastNeighbour(current: QuadNode | undefined): QuadNode | undefined {
    let parent = current?.parentNode;
    if (!parent) return undefined;
    switch (current?.sector) {
      case QuadSector.NorthWest: // 1
        return parent.ne;
      case QuadSector.NorthEast: // 2
        var neighbour = this.getEastNeighbour(parent);
        return neighbour?.nw;
      case QuadSector.SouthWest: // 3
        return parent.se;
      case QuadSector.SouthEast: // 4
        var neighbour = this.getEastNeighbour(parent);
        return neighbour?.sw;
      default:
        throw "Internal error";
    }
  }
  static getWestNeighbour(current: QuadNode | undefined): QuadNode | undefined {
    let parent = current?.parentNode;
    if (!parent) return undefined;
    switch (current?.sector) {
      case QuadSector.NorthWest: // 1
        var neighbour = this.getWestNeighbour(parent);
        return neighbour?.ne;
      case QuadSector.NorthEast: // 2
        return parent.nw;
      case QuadSector.SouthWest: // 3
        var neighbour = this.getWestNeighbour(parent);
        return neighbour?.se;
      case QuadSector.SouthEast: // 4
        return parent.sw;
      default:
        throw "Internal error";
    }
  }



}


