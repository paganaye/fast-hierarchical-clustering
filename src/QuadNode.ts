import { Point, QuadTree } from "./QuadTree";

export const enum QuadSector {
  Root = "root",
  NorthEast = "ne",
  NorthWest = "nw",
  SouthEast = "se",
  SouthWest = "sw"
}

export class QuadNode {

  readonly quadTree: QuadTree;
  private parentNode?: QuadNode;
  readonly xmin: number;
  readonly xmid: number;
  readonly xmax: number;
  readonly ymin: number;
  readonly ymid: number;
  readonly ymax: number;

  nw?: QuadNode;
  ne?: QuadNode;
  sw?: QuadNode;
  se?: QuadNode;
  points?: Point[];
  isLeaf: boolean;
  size: number;
  sector: QuadSector;

  constructor(args: {
    quadTree: QuadTree,
    parentNode?: QuadNode,
    sector: QuadSector
    xmin: number,
    ymin: number,
    size: number
  }) {
    this.quadTree = args.quadTree;
    this.parentNode = args.parentNode;
    this.isLeaf = (args.size <= args.quadTree.nodeSize);
    this.sector = args.sector;
    this.xmin = args.xmin;
    this.ymin = args.ymin;
    this.size = args.size;

    this.xmid = args.xmin + args.size / 2;
    this.xmax = args.xmin + args.size;
    this.ymid = args.ymin + args.size / 2;
    this.ymax = args.ymin + args.size;
  }

  addPoint(point: Point) {
    if (!this.points) {
      this.points = [point];
    } else {
      this.points?.push(point);
    }
  }

  isEmpty(): boolean {
    return (!this.points || this.points.length == 0)
      && (!this.nw || this.nw.isEmpty())
      && (!this.ne || this.ne.isEmpty())
      && (!this.sw || this.sw.isEmpty())
      && (!this.se || this.se.isEmpty());
  }

  static getSector(pointIsWest: boolean, pointIsNorth: boolean) {
    return pointIsWest
      ? (pointIsNorth ? QuadSector.NorthWest : QuadSector.SouthWest)
      : (pointIsNorth ? QuadSector.NorthEast : QuadSector.SouthEast);
  }

  setChildNode(sector: QuadSector, childNode: QuadNode) {
    childNode.sector = sector;
    switch (sector) {
      case QuadSector.NorthEast:
        this.ne = childNode;
        break;
      case QuadSector.NorthWest:
        this.nw = childNode;
        break;
      case QuadSector.SouthEast:
        this.se = childNode;
        break;
      case QuadSector.SouthWest:
        this.sw = childNode;
        break;
    }
  }

  private createChild(isWest: boolean, isNorth: boolean) {
    let quadSector = QuadNode.getSector(isWest, isNorth)
    let childSize = this.size / 2;
    return new QuadNode({
      parentNode: this,
      quadTree: this.quadTree,
      sector: quadSector,
      size: childSize,
      xmin: isWest ? this.xmin : this.xmid,
      ymin: isNorth ? this.ymin : this.ymid
    });
  }

  getOrCreateChild(isWest: boolean, isNorth: boolean): QuadNode {
    if (isWest) {
      if (isNorth) return this.nw || (this.nw = this.createChild(isWest, isNorth));
      else return this.sw || (this.sw = this.createChild(isWest, isNorth));
    } else {
      if (isNorth) return this.ne || (this.ne = this.createChild(isWest, isNorth));
      else return this.se || (this.se = this.createChild(isWest, isNorth));
    }
  }
}




