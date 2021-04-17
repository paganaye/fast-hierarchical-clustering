import { ClassicAvgAlgorithm } from '../avg/ClassicAvgAlgorithm';
import { NewAvgAlgorithm } from '../avg/NewAvgAlgorithm';
import { Pair } from '../avg/Pair';
import { Dendrogram } from '../Cluster';
import { IPoint } from '../IPoint';
import { IAlgorithm } from './IAlgorithm';

export interface IAlgorithmWorkerInput {
    points: IPoint[]
    linkage: string;
    wantedClusters: number;
    newAlgorithm: boolean;
}

export interface IAlgorithmWorkerOutput {
    complete: boolean;
    progress: number;
    dendrograms: Dendrogram[]
}

let globalRunCounter = 0;

function group(input: IAlgorithmWorkerInput): IAlgorithmWorkerOutput {
    let algorithm!: IAlgorithm;
    switch (input.linkage) {
        case "avg":
            algorithm = input.newAlgorithm ? new NewAvgAlgorithm() : new ClassicAvgAlgorithm();
            break;
    }

    algorithm.init(input.points);
    globalRunCounter += 1;
    runBatch(globalRunCounter);
    return { complete: false, progress: 0.1, dendrograms: algorithm.getCurrentDendrograms() }

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
        }
    }
}

onmessage = function (e) {
    console.log("algorithm worker here")
    postMessage(group(e.data as IAlgorithmWorkerInput), undefined as any);
}

