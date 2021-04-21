import { Cluster } from '../src/Cluster';
import { IAlgorithm } from '../src/workers/IAlgorithm';

export function getNormalizedDendrogram(algorithm: IAlgorithm, wantedCluster: number = 1): string {
    let generator = algorithm.forEachClusters();
    let x: IteratorResult<Cluster, any>
    let dendrogramCount: number;
    do {
        x = generator.next()
        dendrogramCount = algorithm.getDendrogramsCount();
    } while (!x.done && dendrogramCount > wantedCluster)

    let dendrograms = algorithm.getCurrentDendrograms();
    return dendrograms.map(d => d.getNormalizedDendrogram()).join(" ")
}