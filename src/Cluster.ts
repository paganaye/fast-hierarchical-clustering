import type { Point } from './Point';
import { IPoint } from './avg/QuadTree';

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

        this.sumX = dendrogram1.getSumX() + dendrogram2.getSumX();
        this.sumY = dendrogram1.getSumY() + dendrogram2.getSumY();
        this.count = dendrogram1.getCount() + dendrogram2.getCount();

        this.x = this.sumX / this.count;
        this.y = this.sumY / this.count;
    }

    toString() {
        let content: string = this.dendrogram1 + "," + this.dendrogram2;
        if (this.tag){
            return `${this.tag} (${this.x},${this.y})`;
        } else {
            return `Cl(${this.x},${this.y})` + ` [${content}]`;
        }
        
    }

    getSumX() { return this.sumX; }
    getSumY() { return this.sumY; }
    getCount() { return this.count; }

}

export type Dendrogram = Cluster | Point;

export function getPoints(dendrogram: Dendrogram, pts: Point[] = []): Point[] {
    if ('count' in dendrogram) {
        getPoints(dendrogram.dendrogram1, pts);
        getPoints(dendrogram.dendrogram2, pts);
    } else pts.push(dendrogram);
    return pts;
}


