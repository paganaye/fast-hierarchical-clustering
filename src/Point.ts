import { PseudoRandom } from '../test/PseudoRandom';

export class Point {
    tag: string | undefined;

    constructor(readonly x: number, readonly y: number, tag: string | undefined = undefined) {
        if (tag) this.tag = tag;
    }

    static randomPoint(tag: string | undefined = undefined): Point {
        return new Point(PseudoRandom.random(), PseudoRandom.random(), tag)
    }
    static randomPointAround(point: Point, maxDistance: number): Point {
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * maxDistance;
        let x = (point.x + Math.cos(angle) * distance + 1.0) % 1;
        let y = (point.y + Math.sin(angle) * distance + 1.0) % 1;
        return new Point(x, y)
    }
    toString() {
        return this.tag ? `#${this.tag}` : `(${this.x},${this.y})`;
    }

    getSumX() { return this.x; }
    getSumY() { return this.y; }
    getCount() { return 1; }
}

