import { Point } from './Point';
import { Dendrogram } from './Cluster';

export interface IAlgorithm {
    init(points: Point[]): void;
    findNearestTwoPoints(): IPair | undefined;
    getCurrentDendrograms(): Dendrogram[];
}

export interface IPair {
    point1: Dendrogram;
    point2: Dendrogram;
    merge: () => void;
}