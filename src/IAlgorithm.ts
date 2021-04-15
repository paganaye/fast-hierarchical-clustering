import { Point } from './Point';
import { Dendrogram } from './Cluster';

export interface IAlgorithm {
    run(points: Point[], clusterCount: number, paint: (dendrograms: Dendrogram[]) => void, finished: (dendogram: Dendrogram[]) => void): void;
}
