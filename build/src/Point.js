import {PseudoRandom} from "../test/PseudoRandom.js";
export class Point {
  constructor(x, y, tag = void 0) {
    this.x = x;
    this.y = y;
    if (tag)
      this.tag = tag;
  }
  static randomPoint(tag = void 0) {
    return new Point(PseudoRandom.random(), PseudoRandom.random(), tag);
  }
  static randomPointAround(point, maxDistance) {
    let angle = Math.random() * Math.PI * 2;
    let distance = Math.random() * maxDistance;
    let x = (point.x + Math.cos(angle) * distance + 1) % 1;
    let y = (point.y + Math.sin(angle) * distance + 1) % 1;
    return new Point(x, y);
  }
  toString() {
    return this.tag ? `#${this.tag}` : `(${this.x},${this.y})`;
  }
  getSumX() {
    return this.x;
  }
  getSumY() {
    return this.y;
  }
  getCount() {
    return 1;
  }
}
