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

        do {
            while (this.pairs.length == 0) {
                for (let c of this.quadTree.forEachPairs()) {
                    if (!c) {
                        console.error("c should not be null")
                    }
                    this.pairs.push(c);
                }
                if (this.pairs.length == 0) {
                    if (!this.quadTree.trim()) return;
                }
                else {
                    this.pairs.sort((a, b) => b.distanceSquared - a.distanceSquared);
                }
                // console.log({ maxDistance: this.maxDistance, pairs: this.pairs.length, nextIncrement: this.increment, });            
            }
            let pair = this.pairs.pop()!;
            if (pair) {
                let { cluster, hasNewPairs } = pair.merge(this.quadTree, newPairs);
                if (hasNewPairs) {
                    this.pairs.push(...newPairs);
                    this.pairs.sort((a, b) => b.distanceSquared - a.distanceSquared);
                }        
                if (cluster) yield cluster;
            } else {
                console.error("why?")
            }
        } while (true)
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
