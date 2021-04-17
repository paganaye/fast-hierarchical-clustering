import { Point } from './Point';
import { Dendrogram } from './Cluster';
import { Pair } from './avg/Pair';

export interface IAlgorithm {
    init(points: Point[]): void;
    findNearestTwoPoints(): Pair | undefined;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

