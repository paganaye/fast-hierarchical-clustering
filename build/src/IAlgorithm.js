import {getDistance} from "./Cluster.js";
export class Pair {
  constructor(point1, point2, merge) {
    this.merge = merge;
    if (point1.x > point2.x || point1.x == point2.x && point1.y > point2.y) {
      this.point1 = point2;
      this.point2 = point1;
    } else {
      this.point1 = point1;
      this.point2 = point2;
    }
  }
  distance() {
    return getDistance(this.point1, this.point2);
  }
  toString() {
    return `${this.point1}-${this.point2}`;
  }
}
