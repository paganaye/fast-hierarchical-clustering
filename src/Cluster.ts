import { IPoint } from './IPoint';
import type { Point } from './Point';

export class Cluster implements IPoint {
    readonly sumX: number;
    readonly sumY: number;
    readonly count: number;
    readonly x: number; // Avg point
    readonly y: number; // Avg point
    readonly dendrogram1: Dendrogram;
    readonly dendrogram2: Dendrogram
    tag: string | undefined;
    deleted: true | undefined;

    constructor(dendrogram1: Dendrogram, dendrogram2: Dendrogram, tag: string | undefined = undefined) {
        if (tag) this.tag = tag;
        if (dendrogram1.x > dendrogram2.x || dendrogram1.x == dendrogram2.x && dendrogram1.y > dendrogram2.y) {
            // we swap them for consistency when comparing different algorithms.
            // this should have little effect.
            this.dendrogram1 = dendrogram2;
            this.dendrogram2 = dendrogram1;
        } else {
            this.dendrogram1 = dendrogram1;
            this.dendrogram2 = dendrogram2;
        }
        if (this.dendrogram1.tag && this.dendrogram2.tag) this.tag = this.dendrogram1.tag + this.dendrogram2.tag


        if ('count' in dendrogram1) {
            this.sumX = dendrogram1.sumX;
            this.sumY = dendrogram1.sumY;
            this.count = dendrogram1.count;
        } else {
            this.sumX = dendrogram1.x;
            this.sumY = dendrogram1.y;
            this.count = 1;
        }
        if ('count' in dendrogram2) {
            this.sumX += dendrogram2.sumX;
            this.sumY += dendrogram2.sumY;
            this.count += dendrogram2.count;
        } else {
            this.sumX += dendrogram2.x;
            this.sumY += dendrogram2.y;
            this.count += 1;
        }
        this.x = this.sumX / this.count;
        this.y = this.sumY / this.count;
    }

    toString() {
        let content: string = this.dendrogram1 + "," + this.dendrogram2;
        if (this.tag) {
            return `${this.tag} (${this.x},${this.y})`;
        } else {
            return `Cl(${this.x},${this.y})` + ` [${content}]`;
        }

    }
}

export type Dendrogram = Cluster | Point;

export function getPoints(dendrogram: Dendrogram, pts: Point[] = []): Point[] {
    if ('count' in dendrogram) {
        getPoints(dendrogram.dendrogram1, pts);
        getPoints(dendrogram.dendrogram2, pts);
    } else pts.push(dendrogram);
    return pts;
}


