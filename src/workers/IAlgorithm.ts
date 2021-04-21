import { Cluster, Dendrogram } from '../Cluster';
import { IPoint } from '../IPoint';

export interface IAlgorithm {
    name: string;
    init(points: IPoint[]): void;
    forEachClusters(): Generator<Cluster>;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

