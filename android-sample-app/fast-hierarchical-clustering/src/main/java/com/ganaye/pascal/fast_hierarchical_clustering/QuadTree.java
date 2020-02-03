//import { QuadNode, QuadSector, printQuadNode as logQuadNode } from "./QuadNode";
//import { Point } from "./Point";
//import { LogLevel } from "./Log";
//
//export interface QuadTreeConfig {
//  nodeSize: number
//}
//
//export class QuadTree {
//  root: QuadNode;
//  nodeSize: number;
//
//  constructor(config: QuadTreeConfig) {
//    // we could lower the node size as we go along
//    this.nodeSize = config.nodeSize;
//
//    this.root = new QuadNode({
//      quadTree: this,
//      xmin: 0,
//      ymin: 0,
//      size: this.nodeSize,
//      sector: QuadSector.Root
//    });
//  }
//
//  add(point: Point): QuadNode {
//    // if (point.id==50) debugger;
//    var node = this.root;
//    while (node != null) {
//      if (point.x >= node.xmin && point.x < node.xmax
//        && point.y >= node.ymin && point.y < node.ymax) {
//        // we're in
//        return node.addPoint(point)
//      } else {
//        if (node.sector !== QuadSector.Root) {
//          debugger;
//        }
//        // we're out
//        let pointIsWest = point.x < node.xmin;
//        let pointIsNorth = point.y < node.ymin;
//        let newSector = QuadNode.getSector(!pointIsWest, !pointIsNorth);
//        let xmin = pointIsWest ? node.xmin - node.size : node.xmin;
//        let ymin = pointIsNorth ? node.ymin - node.size : node.ymin;
//
//        this.root = new QuadNode({
//          quadTree: this,
//          sector: QuadSector.Root,
//          xmin,
//          ymin,
//          size: node.size * 2,
//        });
//        if (!node.isEmpty()) {
//          this.root.attachChildNode(newSector, node);
//        }
//        node = this.root;
//      }
//    }
//    throw new Error("Quatree.add: Unexpected error. Did not find a new node to insert to.")
//  }
//
//  static getNorthEastNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest:
//        var neighbour = this.getNorthNeighbour(parent);
//        return neighbour?.se;
//      case QuadSector.NorthEast:
//        var neighbour = this.getNorthEastNeighbour(parent);
//        return neighbour?.sw;
//      case QuadSector.SouthWest:
//        return parent.ne;
//      case QuadSector.SouthEast:
//        var neighbour = this.getEastNeighbour(parent);
//        return neighbour?.nw;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getNorthWestNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest: // 1
//        var neighbour = this.getNorthWestNeighbour(parent);
//        return neighbour?.se;
//      case QuadSector.NorthEast: // 2
//        var neighbour = this.getNorthNeighbour(parent);
//        return neighbour?.sw;
//      case QuadSector.SouthWest: // 3
//        var neighbour = this.getWestNeighbour(parent);
//        return neighbour?.ne;
//      case QuadSector.SouthEast: // 4
//        return parent.nw;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getNorthNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest: // 1
//        var neighbour = this.getNorthNeighbour(parent);
//        return neighbour?.sw;
//      case QuadSector.NorthEast: // 2
//        var neighbour = this.getNorthNeighbour(parent);
//        return neighbour?.se;
//      case QuadSector.SouthWest: // 3
//        return parent.nw;
//      case QuadSector.SouthEast: // 4
//        return parent.ne;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getSouthEastNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest:
//        return parent.se;
//      case QuadSector.NorthEast:
//        var neighbour = this.getEastNeighbour(parent);
//        return neighbour?.sw;
//      case QuadSector.SouthWest:
//        var neighbour = this.getSouthNeighbour(parent);
//        return neighbour?.ne;
//      case QuadSector.SouthEast:
//        var neighbour = this.getSouthEastNeighbour(parent);
//        return neighbour?.nw;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getSouthWestNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest: // 1
//        var neighbour = this.getWestNeighbour(parent);
//        return neighbour?.se;
//      case QuadSector.NorthEast: // 2
//        return parent.sw;
//      case QuadSector.SouthWest: // 3
//        var neighbour = this.getSouthWestNeighbour(parent);
//        return neighbour?.ne;
//      case QuadSector.SouthEast: // 4
//        var neighbour = this.getSouthNeighbour(parent);
//        return neighbour?.nw;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getSouthNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest: // 1
//        return parent.sw;
//      case QuadSector.NorthEast: // 2
//        return parent.se;
//      case QuadSector.SouthWest: // 3
//        var neighbour = this.getSouthNeighbour(parent);
//        return neighbour?.nw;
//      case QuadSector.SouthEast: // 4
//        var neighbour = this.getSouthNeighbour(parent);
//        return neighbour?.ne;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getEastNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest: // 1
//        return parent.ne;
//      case QuadSector.NorthEast: // 2
//        var neighbour = this.getEastNeighbour(parent);
//        return neighbour?.nw;
//      case QuadSector.SouthWest: // 3
//        return parent.se;
//      case QuadSector.SouthEast: // 4
//        var neighbour = this.getEastNeighbour(parent);
//        return neighbour?.sw;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  static getWestNeighbour(current: QuadNode | undefined): QuadNode | undefined {
//    let parent = current?.parentNode;
//    if (!parent) return undefined;
//    switch (current?.sector) {
//      case QuadSector.NorthWest: // 1
//        var neighbour = this.getWestNeighbour(parent);
//        return neighbour?.ne;
//      case QuadSector.NorthEast: // 2
//        return parent.nw;
//      case QuadSector.SouthWest: // 3
//        var neighbour = this.getWestNeighbour(parent);
//        return neighbour?.se;
//      case QuadSector.SouthEast: // 4
//        return parent.sw;
//      default:
//        throw "Internal error";
//    }
//  }
//
//  getNodeSize() {
//    return this.nodeSize;
//  }
//
//}
//
//export function logQuadTree(level: LogLevel, tree: QuadTree) {
//  logQuadNode(level, "", tree.root);
//}
//
