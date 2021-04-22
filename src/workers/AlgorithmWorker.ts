import { ClassicAvgAlgorithm } from '../classic/ClassicAvgAlgorithm';
import { NewAvgAlgorithm } from '../new/NewAvgAlgorithm';
import { FasterAvgAlgorithm } from '../faster/FasterAvgAlgorithm';
import { ExperimentalAvgAlgorithm } from '../experimental/ExperimentalAvgAlgorithm';
import { Dendrogram } from '../Cluster';
import { IPoint } from '../IPoint';
import { IAlgorithm } from './IAlgorithm';


export enum AlgorithmType {
    ClassicAvg,
    NewAvg,
    FasterAvg,
    ExperimentalAvg,
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
        case AlgorithmType.ExperimentalAvg:
            algorithm = new ExperimentalAvgAlgorithm();
            break;
        default:
            postMessage({ canceled: true, progress: 0 }, undefined as any);
            return;
    }
    algorithm.init(input.points);
    postMessage({ complete: false, progress: 0, dendrograms: undefined }, undefined as any);
    let batchNo = 0;

    setTimeout(() => runBatch(globalRunCounter), 0);


    function runBatch(runCounter: number) {
        let dendrogramsCount!: number;
        let batchEndTime = new Date().getTime() + 2500;

        let generator = algorithm.forEachClusters();
        do {
            let result = generator.next();
            dendrogramsCount = algorithm.getDendrogramsCount();
            if (result.done || dendrogramsCount <= input.wantedClusters) break;
            let cluster = result.value;
        } while (new Date().getTime() < batchEndTime);

        if (runCounter == globalRunCounter) {
            if (dendrogramsCount > input.wantedClusters) {
                let progress = (input.points.length + input.wantedClusters - dendrogramsCount) / input.points.length;
                postMessage({ complete: false, progress, dendrograms: (batchNo++ % 4 == 0) ? algorithm.getCurrentDendrograms() : undefined }, undefined as any);
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

