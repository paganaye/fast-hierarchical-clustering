import { Point } from './Point';
import { Dendrogram } from './Cluster';
import { Pair } from './avg/Pair';

export interface IAlgorithm {
    name: string;
    init(points: Point[]): void;
    findNearestTwoPoints(): Pair | undefined;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

