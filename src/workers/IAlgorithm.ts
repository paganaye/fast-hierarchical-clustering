import { Cluster, Dendrogram } from '../Cluster';
import { IPoint } from '../IPoint';

export interface IAlgorithm {
    name: string;
    className: string;
    init(points: IPoint[]): void;
    forEachClusters(): Generator<Cluster>;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}
