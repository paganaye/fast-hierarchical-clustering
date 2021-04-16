import { Point } from './Point';
import { Dendrogram, getDistance } from './Cluster';

export interface IAlgorithm {
    init(points: Point[]): void;
    findNearestTwoPoints(): Pair | undefined;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

export class Pair {
    readonly point1: Dendrogram;
    readonly point2: Dendrogram;

    constructor(point1: Dendrogram, point2: Dendrogram, readonly merge: () => void) {
        if (point1.x > point2.x || point1.x == point2.x && point1.y > point2.y) {
            // we swap them for consistency when comparing different algorithms.
            // this should have little effect.
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