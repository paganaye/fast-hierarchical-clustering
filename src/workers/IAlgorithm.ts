import { Dendrogram } from '../Cluster';
import { Pair } from '../Pair';
import { IPoint } from '../IPoint';

export interface IAlgorithm {
    name: string;
    init(points: IPoint[]): void;
    getNearestPairs(): Generator<Pair>;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

