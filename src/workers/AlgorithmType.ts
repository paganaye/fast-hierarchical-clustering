import { ClassicAvgAlgorithm } from '../classic/ClassicAvgAlgorithm';
import { NewAvgAlgorithm } from '../new/NewAvgAlgorithm';
import { IAlgorithm } from './IAlgorithm';
import { IPoint } from '../IPoint';

export enum AlgorithmType {
    ClassicAvg,
    NewAvg,
    None
}

export function instantiateAlgorithm(algorithmType: AlgorithmType, points: IPoint[] | undefined): IAlgorithm | undefined {
    let algorithm: IAlgorithm | undefined;
    switch (algorithmType) {
        case AlgorithmType.ClassicAvg:
            algorithm = new ClassicAvgAlgorithm();
            break;
        case AlgorithmType.NewAvg:
            algorithm = new NewAvgAlgorithm();
            break;
    }
    if (points)
        algorithm?.init(points)
    return algorithm;
}

