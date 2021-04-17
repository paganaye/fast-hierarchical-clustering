import { Dendrogram } from '../Cluster';
import { Pair } from '../avg/Pair';
import { IPoint } from '../avg/QuadTree';

export interface IAlgorithm {
    name: string;
    init(points: IPoint[]): void;
    findNearestTwoPoints(): Pair | undefined;
    getCurrentDendrograms(): Dendrogram[];
    getDendrogramsCount(): number;
}

