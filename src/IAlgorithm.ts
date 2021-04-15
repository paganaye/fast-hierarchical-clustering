import { Point } from './Point';
import { Dendrogram } from './Cluster';

export interface IAlgorithm {
    init(points: Point[]): void;
    findNearestTwoPoints(): Pair | undefined;
    getCurrentDendrograms(): Dendrogram[];
}

export class Pair {
    constructor(readonly point1: Dendrogram, readonly point2: Dendrogram, readonly merge: () => void) { }

    toString() {
        return `${this.point1}-${this.point2}`;
    }
}