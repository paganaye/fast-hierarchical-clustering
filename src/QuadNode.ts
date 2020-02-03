import { QuadTree } from "./QuadTree";
import { Point, logPoints } from "./Point";
import { Log, LogLevel } from "./Log";

export enum QuadSector {
  Root,
  NorthWest,
  NorthEast,
  SouthWest,
  SouthEast
}

export class QuadNode {
  static nodeIdCounter = 0;
  readonly id: number;
  readonly quadTree: QuadTree;
  parentNode?: QuadNode;
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
    this.id = ++QuadNode.nodeIdCounter;
    this.sector = args.sector;
    this.xmin = args.xmin;
    this.ymin = args.ymin;
    this.size = args.size;

    this.xmid = args.xmin + args.size / 2;
    this.xmax = args.xmin + args.size;
    this.ymid = args.ymin + args.size / 2;
    this.ymax = args.ymin + args.size;
  }

  mergeChildren() {
    if (!this.points) this.points = []
    this.mergeChild(this.ne);
    this.mergeChild(this.nw);
    this.mergeChild(this.se);
    this.mergeChild(this.sw);
    this.ne = this.nw = this.se = this.sw = undefined;
  }

  private mergeChild(child?: QuadNode) {
    if (!child) return;
    child.mergeChildren();
    if (child.points) {
      for (let point of child.points) {
        this.points?.push(point);
      }
    }
  }

  addPoint(point: Point): QuadNode {
    if (this.isLeaf()) {
      let points = this.points || (this.points = []);
      points.push(point);
      return this;
    } else {
      let isWest = point.x < this.xmid;
      let isNorth = point.y < this.ymid;
      let node = this.getOrCreateChild(isWest, isNorth);
      return node.addPoint(point)
    }
  }

  isLeaf(): boolean {
    return (this.size <= this.quadTree.nodeSize);
  }

  // distributeToChildren() {
  //   let pointToDistribute = this.points;
  //   if (pointToDistribute) {
  //     this.points = undefined
  //     for (let point of pointToDistribute) {
  //       this.addPoint(point)
  //     }
  //   }
  // }

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

  attachChildNode(sector: QuadSector, childNode: QuadNode) {
    childNode.parentNode = this;
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


  remove(point: Point) {
    let indexOfPoint = this.points?.indexOf(point);
    if (indexOfPoint != null && indexOfPoint >= 0) {
      this.points?.splice(indexOfPoint, 1);
    }
  }

  getLevel(): number {
    if (this.parentNode == null) return 0
    else return this.parentNode.getLevel() + 1;
  }

}

export function printQuadNode(level: LogLevel, prefix: string, node: QuadNode | undefined) {
  if (!node || !Log.willLog(level)) return;
  let prefix2 = prefix + "  ";
  Log.writeLine(LogLevel.Verbose, prefix + QuadSector[node.sector] + ": " + JSON.stringify({ id: node.id, xmin: node.xmin, ymin: node.ymin, size: node.size }))
  logPoints(level, prefix2, node.points);
  printQuadNode(level, prefix2, node.nw)
  printQuadNode(level, prefix2, node.ne)
  printQuadNode(level, prefix2, node.sw)
  printQuadNode(level, prefix2, node.se)
}



