import type { Cluster } from './Cluster';

export class Point {
    tag: String | undefined;
    deleted: true | undefined;

    constructor(readonly x: number, readonly y: number, tag: string | undefined = undefined) {
        if (tag) this.tag = tag;
    }

    static randomPoint(): Point {
        return new Point(Math.random(), Math.random())
    }
    static randomPointAround(point: Point, maxDistance: number): Point {
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * maxDistance;
        let x = (point.x + Math.cos(angle) * distance + 1.0) % 1;
        let y = (point.y + Math.sin(angle) * distance + 1.0) % 1;
        return new Point(x, y)
    }
    toString() {
        return this.tag ? `Pt#${this.tag}` : `Pt(${this.x},${this.y})`;
    }
}

