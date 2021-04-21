import { PseudoRandom } from '../test/PseudoRandom';
import { getDistance, IPoint } from './IPoint';

export class Point implements IPoint {
    tag: string | undefined;

    constructor(readonly x: number, readonly y: number, tag: string | undefined = undefined) {
        if (tag) this.tag = tag;
    }

    static randomPoint(tag: string | undefined = undefined): Point {
        return new Point(PseudoRandom.random(), PseudoRandom.random(), tag)
    }
    static randomPointAround(point: IPoint, maxDistance: number): Point {
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * maxDistance;
        let x = (point.x + Math.cos(angle) * distance + 1.0) % 1;
        let y = (point.y + Math.sin(angle) * distance + 1.0) % 1;
        return new Point(x, y)
    }

    toString() {
        return this.tag || `(${this.x.toFixed(3)},${this.y.toFixed(3)})`;
    }

    getNormalizedDendrogram(): string {
        return this.toString()
    }

    distanceTo(pt2: IPoint) {
        return getDistance(this, pt2);
    }
}


