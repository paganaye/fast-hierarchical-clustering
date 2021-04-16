import {getDistance} from "./Cluster.js";
export class QuadTree {
  constructor(initialLevels = 10) {
    this.initialLevels = initialLevels;
    this.pointCount = 0;
    this.currentLevels = initialLevels;
    this.root = new QuadNode(initialLevels - 1, 0.5, 0.5, 0.5);
    this.root.nodeSize = 2;
  }
  insert(point) {
    this.pointCount += 1;
    this.root.insert(point);
  }
  delete(point) {
    if (this.root.delete(point)) {
      this.pointCount -= 1;
      return true;
    } else
      return false;
  }
  trim() {
    if (this.root.level == 0)
      return false;
    else {
      this.root.trim();
      return true;
    }
  }
  getNeighbours() {
    let result = [];
    this.root.getNeighbours({}, result);
    return result;
  }
  insertAndAddNeighbours(newCluster, result) {
    this.pointCount += 1;
    this.root.insertAndAddNeighbours(newCluster, {}, result);
  }
  getDendrograms() {
    let result = [];
    this.root.getDendrograms(result);
    return result;
  }
  print() {
    this.root.print("");
  }
}
var Quarter;
(function(Quarter2) {
  Quarter2[Quarter2["TopLeft"] = 0] = "TopLeft";
  Quarter2[Quarter2["TopRight"] = 1] = "TopRight";
  Quarter2[Quarter2["BottomLeft"] = 2] = "BottomLeft";
  Quarter2[Quarter2["BottomRight"] = 3] = "BottomRight";
})(Quarter || (Quarter = {}));
export class QuadNode {
  constructor(level, x, y, halfSize) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.nodeSize = halfSize * 2;
    this.quarterSize = halfSize / 2;
  }
  insertAndAddNeighbours(cluster, ownSiblings, result) {
    if (this.level == 0) {
      this.addNewPairs(cluster, result);
      this.addNewPairsWith(cluster, ownSiblings.topLeft, result);
      this.addNewPairsWith(cluster, ownSiblings.top, result);
      this.addNewPairsWith(cluster, ownSiblings.topRight, result);
      this.addNewPairsWith(cluster, ownSiblings.left, result);
      this.addNewPairsWith(cluster, ownSiblings.right, result);
      this.addNewPairsWith(cluster, ownSiblings.bottomLeft, result);
      this.addNewPairsWith(cluster, ownSiblings.bottom, result);
      this.addNewPairsWith(cluster, ownSiblings.bottomRight, result);
      this.insert(cluster);
    } else {
      let quarter = this.getQuarter(cluster);
      let node = this.getOrCreateNode(quarter);
      node.insertAndAddNeighbours(cluster, this.getQuarterSiblings(ownSiblings, quarter), result);
    }
  }
  getQuarterSiblings(ownSiblings, quarter) {
    switch (quarter) {
      case 0:
        return {
          topLeft: ownSiblings.topLeft?.bottomRight,
          top: ownSiblings.top?.bottomLeft,
          topRight: ownSiblings.top?.bottomRight,
          left: ownSiblings.left?.topRight,
          right: this.topRight,
          bottomLeft: ownSiblings.left?.bottomRight,
          bottom: this.bottomLeft,
          bottomRight: this.bottomRight
        };
      case 1:
        return {
          topLeft: ownSiblings.top?.bottomLeft,
          top: ownSiblings.top?.bottomRight,
          topRight: ownSiblings.topRight?.bottomLeft,
          left: this.topLeft,
          right: ownSiblings.right?.topLeft,
          bottomLeft: this.bottomLeft,
          bottom: this.bottomRight,
          bottomRight: ownSiblings.right?.bottomLeft
        };
      case 2:
        return {
          topLeft: ownSiblings.left?.topRight,
          top: this.topLeft,
          topRight: this.topRight,
          left: ownSiblings.left?.bottomRight,
          right: this.bottomRight,
          bottomLeft: ownSiblings.bottomLeft?.topRight,
          bottom: ownSiblings.bottom?.topLeft,
          bottomRight: ownSiblings.bottom?.topRight
        };
      case 3:
        return {
          topLeft: this.topLeft,
          top: this.topRight,
          topRight: ownSiblings.right?.topLeft,
          left: this.bottomLeft,
          right: ownSiblings.right?.bottomLeft,
          bottomLeft: ownSiblings.bottom?.topLeft,
          bottom: ownSiblings.bottom?.topRight,
          bottomRight: ownSiblings.bottomRight?.topLeft
        };
    }
  }
  getNeighbours(siblings, result) {
    if (this.level == 0) {
      this.addSelfPairs(result);
      this.addPairsWith(siblings.right, result);
      this.addPairsWith(siblings.bottomLeft, result);
      this.addPairsWith(siblings.bottom, result);
      this.addPairsWith(siblings.bottomRight, result);
    } else {
      this.topLeft?.getNeighbours(this.getQuarterSiblings(siblings, 0), result);
      this.topRight?.getNeighbours(this.getQuarterSiblings(siblings, 1), result);
      this.bottomLeft?.getNeighbours(this.getQuarterSiblings(siblings, 2), result);
      this.bottomRight?.getNeighbours(this.getQuarterSiblings(siblings, 3), result);
    }
  }
  addSelfPairs(result) {
    if (!this.points || this.points.length < 2)
      return;
    for (let i = 0; i < this.points.length; i++) {
      let point1 = this.points[i];
      for (let j = i + 1; j < this.points.length; j++) {
        let point2 = this.points[j];
        let distance = getDistance(point1, point2);
        if (distance < this.nodeSize)
          result.push(new QuadPair(point1, point2, distance));
      }
    }
  }
  addNewPairs(cluster, result) {
    if (!this.points || !this.points.length)
      return;
    for (let i = 0; i < this.points.length; i++) {
      let point1 = this.points[i];
      let distance = getDistance(point1, cluster);
      if (distance < this.nodeSize)
        result.push(new QuadPair(point1, cluster, distance));
    }
  }
  addPairsWith(node2, result) {
    if (!this.points || this.points.length == 0)
      return;
    let points2 = node2?.points;
    if (points2 && points2.length) {
      for (let point1 of this.points) {
        for (let point2 of points2) {
          let distance = getDistance(point1, point2);
          if (distance < this.nodeSize)
            result.push(new QuadPair(point1, point2, distance));
        }
      }
    }
  }
  addNewPairsWith(cluster, node2, result) {
    let points2 = node2?.points;
    if (points2 && points2.length) {
      for (let point2 of points2) {
        let distance = getDistance(cluster, point2);
        if (distance < this.nodeSize)
          result.push(new QuadPair(cluster, point2, distance));
      }
    }
  }
  insert(point) {
    if (this.level > 0) {
      let quarter = this.getQuarter(point);
      let node = this.getOrCreateNode(quarter);
      node.insert(point);
    } else {
      (this.points || (this.points = [])).push(point);
    }
  }
  delete(point) {
    if (this.level > 0) {
      let quarter = this.getQuarter(point);
      let node = this.getNode(quarter);
      if (node)
        return node.delete(point);
      else
        return false;
    } else {
      if (this.points) {
        let index = this.points.indexOf(point);
        if (index >= 0) {
          this.points.splice(index, 1);
          return true;
        } else
          return false;
      } else
        return false;
    }
  }
  trim() {
    this.topLeft?.trim();
    this.topRight?.trim();
    this.bottomLeft?.trim();
    this.bottomRight?.trim();
    this.level -= 1;
    if (this.level == 0) {
      if (!this.points)
        this.points = [];
      if (this.topLeft?.points)
        this.points.push(...this.topLeft?.points);
      if (this.topRight?.points)
        this.points.push(...this.topRight?.points);
      if (this.bottomLeft?.points)
        this.points.push(...this.bottomLeft?.points);
      if (this.bottomRight?.points)
        this.points.push(...this.bottomRight?.points);
      this.topLeft = void 0;
      this.topRight = void 0;
      this.bottomLeft = void 0;
      this.bottomRight = void 0;
    }
  }
  getQuarter(point) {
    if (point.y > this.y) {
      return point.x > this.x ? 3 : 2;
    } else {
      return point.x > this.x ? 1 : 0;
    }
  }
  getNode(quarter) {
    switch (quarter) {
      case 0:
        return this.topLeft;
      case 1:
        return this.topRight;
      case 2:
        return this.bottomLeft;
      case 3:
        return this.bottomRight;
    }
  }
  getOrCreateNode(quarter) {
    switch (quarter) {
      case 0:
        return this.topLeft || (this.topLeft = new QuadNode(this.level - 1, this.x - this.quarterSize, this.y - this.quarterSize, this.quarterSize));
      case 1:
        return this.topRight || (this.topRight = new QuadNode(this.level - 1, this.x + this.quarterSize, this.y - this.quarterSize, this.quarterSize));
      case 2:
        return this.bottomLeft || (this.bottomLeft = new QuadNode(this.level - 1, this.x - this.quarterSize, this.y + this.quarterSize, this.quarterSize));
      case 3:
        return this.bottomRight || (this.bottomRight = new QuadNode(this.level - 1, this.x + this.quarterSize, this.y + this.quarterSize, this.quarterSize));
    }
  }
  getDendrograms(result) {
    this.topLeft?.getDendrograms(result);
    this.topRight?.getDendrograms(result);
    this.bottomLeft?.getDendrograms(result);
    this.bottomRight?.getDendrograms(result);
    if (this.points && this.points.length) {
      result.push(...this.points);
    }
  }
  print(prefix) {
    if (this.topLeft) {
      console.log(prefix + "topleft");
      this.topLeft.print(prefix + "  ");
    }
    if (this.topRight) {
      console.log(prefix + "topright");
      this.topRight.print(prefix + "  ");
    }
    if (this.bottomLeft) {
      console.log(prefix + "bottomleft");
      this.bottomLeft.print(prefix + "  ");
    }
    if (this.bottomRight) {
      console.log(prefix + "bottomright");
      this.bottomRight.print(prefix + "  ");
    }
    if (this.points) {
      for (let pt of this.points) {
        console.log(prefix + " - " + pt.toString());
      }
    }
  }
}
export class QuadPair {
  constructor(point1, point2, distance) {
    this.point1 = point1;
    this.point2 = point2;
    this.distance = distance;
  }
  toString() {
    return this.point1.toString() + " " + this.point2.toString() + " " + this.distance;
  }
}
