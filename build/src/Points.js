import {Point} from "./Point.js";
export class Points {
  static addRandomPoints(points, count) {
    for (let i = 0; i < count; i++) {
      points.push(Point.randomPoint());
    }
  }
  static addRandomPointsAround(points, count, point, distance) {
    for (let i = 0; i < count; i++) {
      points.push(Point.randomPointAround(point, distance));
    }
  }
}
