import { Dendrogram } from '../Cluster';
import { Pair } from '../Pair';
import { IPoint } from '../IPoint';

export interface IAlgorithm {
    name: string;
    init(points: IPoint[]): void;
    findNearestTwoPoints(): Pair | undefined;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

