import { QuadNode, QuadSector } from "./QuadNode";

export interface Point {
  id: number,
  x: number,
  y: number
}
export interface QuadTreeConfig {
  nodeSize: number
}
export const enum RangePos {
  beforeMin,
  beforeMid,
  afterMid,
  afterMax
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
        // we're out
        let pointIsWest = point.x < node.xmin;
        let pointIsNorth = point.y < node.ymin;
        let newSector = QuadNode.getSector(pointIsWest, pointIsNorth);
        let xmin = pointIsWest ? node.xmin - node.size : node.xmin;
        let ymin = pointIsNorth ? node.ymin - node.size : node.ymin;

        this.root = new QuadNode({
          quadTree: this,
          sector: QuadSector.Root,
          xmin,
          ymin,
          size: node.size * 2,
        });
        if (!node.isEmpty()) this.root.setChildNode(newSector, node);
        node = this.root;
      }
    }
  }

  private addToCurrentRoot(point: Point): boolean {
    let root = this.root;
    return true;
  }

  private expandRoot(point: Point) {
    let oldRoot = this.root;
    var xmin = oldRoot.xmin;
    var ymin = oldRoot.ymin;
    let oldRootIsWest = point.x >= oldRoot.xmax;
    let oldRootIsNorth = point.y >= oldRoot.ymax;
    if (!oldRootIsWest)
      xmin += oldRoot.size;
    if (!oldRootIsNorth)
      ymin += oldRoot.size;
    let newRoot = new QuadNode({
      quadTree: this,
      xmin,
      ymin,
      size: oldRoot.size * 2,
      sector: QuadSector.Root
    });
    if (oldRootIsNorth) {
      if (oldRootIsWest) {
        oldRoot.sector = QuadSector.NorthWest;
        newRoot.nw = oldRoot;
      }
      else {
        oldRoot.sector = QuadSector.NorthEast;
        newRoot.ne = oldRoot;
      }
    }
    else {
      if (oldRootIsWest) {
        oldRoot.sector = QuadSector.SouthWest;
        newRoot.sw = oldRoot;
      }
      else {
        oldRoot.sector = QuadSector.SouthEast;
        newRoot.se = oldRoot;
      }
    }
    return newRoot;
  }
  //getQuad(currentQuad: QuadNode) {
  // let path = currentQuad.path;
  // let points = currentQuad.points;
  // let xmin = currentQuad.xmin;
  // let xmax = currentQuad.xmax;
  // let ymin = currentQuad.ymin;
  // let ymax = currentQuad.ymax;

  // let width = xmax - xmin;
  // let height = ymax - ymin;

  // let count = points.length;
  // let depth = currentQuad.depth;
  // if (width >= CLUSTER_MIN_SIZE || height >= CLUSTER_MIN_SIZE) {
  //   let ne = [],
  //     nw = [],
  //     se = [],
  //     sw = [];
  //   let xmid = (xmin + xmax) / 2;
  //   let ymid = (ymin + ymax) / 2;
  //   for (let i in points) {
  //     let point = points[i];
  //     let isWest = point.x < xmid;
  //     let isNorth = point.y < ymid;
  //     if (isWest) {
  //       if (isNorth) nw.push(point);
  //       else sw.push(point);
  //     } else {
  //       if (isNorth) ne.push(point);
  //       else se.push(point);
  //     }
  //   }
  //   if (nw.length)
  //     currentQuad.nw = getQuad({
  //       path: path.concat(0),
  //       points: nw,
  //       xmin: xmin,
  //       xmax: xmid,
  //       ymin: ymin,
  //       ymax: ymid,
  //       parent: currentQuad
  //     });
  //   if (ne.length)
  //     currentQuad.ne = getQuad({
  //       path: path.concat(1),
  //       points: ne,
  //       xmin: xmid,
  //       xmax: xmax,
  //       ymin: ymin,
  //       ymax: ymid,
  //       parent: currentQuad
  //     });
  //   if (sw.length)
  //     currentQuad.sw = getQuad({
  //       path: path.concat(2),
  //       points: sw,
  //       xmin: xmin,
  //       xmax: xmid,
  //       ymin: ymid,
  //       ymax: ymax,
  //       parent: currentQuad
  //     });
  //   if (se.length)
  //     currentQuad.se = getQuad({
  //       path: path.concat(3),
  //       points: se,
  //       xmin: xmid,
  //       xmax: xmax,
  //       ymin: ymid,
  //       ymax: ymax,
  //       parent: currentQuad
  //     });
  //   currentQuad.points = [];
  // }
  // currentQuad.count = count;
  //  return currentQuad;
  //  }


}


