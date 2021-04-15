import type { Point } from './Point';

export class Cluster {
    readonly sumX: number;
    readonly sumY: number;
    readonly count: number;
    readonly x: number; // mean point
    readonly y: number; // mean point
    tag: string | undefined;
    deleted: true | undefined;

    constructor(readonly dendrograms: Dendrogram[]) {
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        for (let part of dendrograms) {
            if ("count" in part) {
                sumX += part.sumX;
                sumY += part.sumY;
                count += part.count;
            } else {
                sumX += part.x;
                sumY += part.y;
                count += 1;
            }
        }
        this.sumX = sumX;
        this.sumY = sumY;
        this.count = count;
        this.x = sumX / count;
        this.y = sumY / count;
    }

    toString() {
        return this.tag ? `Cl#${this.tag}` : `Cl(${this.x},${this.y} ${this.count} points)`;
    }

}

export type Dendrogram = Cluster | Point;

export function getPoints(dendrogram: Dendrogram, pts: Point[] = []): Point[] {
    if ('count' in dendrogram) {
        for (let innerPoint of dendrogram.dendrograms) {
            getPoints(innerPoint, pts);
        }
    } else pts.push(dendrogram);
    return pts;
}

export function getDistance(pt1: Dendrogram, pt2: Dendrogram) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    return Math.sqrt(dx * dx + dy * dy);
}