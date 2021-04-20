import { ClassicAvgAlgorithm } from '../classic/ClassicAvgAlgorithm';
import { NewAvgAlgorithm } from '../new/NewAvgAlgorithm';
import { FasterAvgAlgorithm } from '../faster/FasterAvgAlgorithm';
import { Pair } from '../Pair';
import { Dendrogram } from '../Cluster';
import { IPoint } from '../IPoint';
import { IAlgorithm } from './IAlgorithm';


export enum AlgorithmType {
    ClassicAvg,
    NewAvg,
    FasterAvg,
    None
}

export interface IAlgorithmWorkerInput {
    points: IPoint[],
    wantedClusters: number;
    algorithmType: AlgorithmType
}

export interface IAlgorithmWorkerOutput {
    complete: boolean;
    canceled?: boolean;
    progress: number;
    dendrograms: Dendrogram[]
}

let globalRunCounter = 0;

function group(input: IAlgorithmWorkerInput) {
    let algorithm!: IAlgorithm;
    globalRunCounter += 1;
    console.log({ globalRunCounter, type: input.algorithmType });

    switch (input.algorithmType) {
        case AlgorithmType.ClassicAvg:
            algorithm = new ClassicAvgAlgorithm();
            break;
        case AlgorithmType.NewAvg:
            algorithm = new NewAvgAlgorithm();
            break;
        case AlgorithmType.FasterAvg:
            algorithm = new FasterAvgAlgorithm();
            break;
        default:
            postMessage({ canceled: true, progress: 0 }, undefined as any);
            return;
    }
    algorithm.init(input.points);
    runBatch(globalRunCounter);


    function runBatch(runCounter: number) {
        let pair: Pair | undefined;
        let dendogramsCount!: number;
        let batchEndTime = new Date().getTime() + 500;

        while (new Date().getTime() < batchEndTime) {
            pair = algorithm.findNearestTwoPoints();
            if (pair) {
                pair.merge();
            }
            dendogramsCount = algorithm.getDendrogramsCount();
            if (!pair || dendogramsCount <= input.wantedClusters) break;
        }
        if (runCounter == globalRunCounter) {
            if (pair && dendogramsCount > input.wantedClusters) {
                let progress = (input.points.length + input.wantedClusters - dendogramsCount) / input.points.length;
                postMessage({ complete: false, progress, dendrograms: algorithm.getCurrentDendrograms() }, undefined as any);
                setTimeout(() => runBatch(runCounter), 0);
            } else {
                postMessage({ complete: true, progress: 1, dendrograms: algorithm.getCurrentDendrograms() }, undefined as any);
            }
        } else {
            console.log("stopping batch " + runCounter);
        }
    }
}

onmessage = function (e) {
    console.log("algorithmWorker", e.data);
    group(e.data as IAlgorithmWorkerInput);
}

