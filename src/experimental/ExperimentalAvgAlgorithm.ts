import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { Point } from '../Point';
import { ExperimentalQuadTree } from './ExperimentalQuadTree';
import { ClusterEx, PointEx, QuadPairEx } from './ExperimentalQuadNode';

export class ExperimentalAvgAlgorithm implements IAlgorithm {
    className = "ExperimentalAvgAlgorithm";
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: ExperimentalQuadTree;
    pairs: QuadPairEx[] = [];

    constructor(points: Point[] | undefined = undefined, private initialLevels: number = 10) {
        this.quadTree = new ExperimentalQuadTree(initialLevels);
        if (points) this.init(points);
    }

    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(new PointEx(point.x, point.y, point.tag));
        }
    }

    *forEachClusters(): Generator<Cluster> {
        let cluster: Cluster | undefined;
        let newPairs: QuadPairEx[] = [];

        let mergedSomething: boolean;
        do {
            do {
                mergedSomething = false;
                for (let node of this.quadTree.forEachQuadLeaf()) {
                    for (cluster of node.mergePoints(this.quadTree)) {
                        yield cluster;
                        mergedSomething = true;
                    }
                }
            } while (mergedSomething)
        } while (this.quadTree.trim());
    }
    /*
    *forEachClusters(): Generator<ClusterEx> {
    }
*/

    getCurrentDendrograms(): Dendrogram[] {
        return this.quadTree.getDendrograms();
    }

    getDendrogramsCount(): number {
        return this.quadTree.pointCount;
    }
}
