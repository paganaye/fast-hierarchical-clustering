import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { Pair } from '../Pair';
import { Point } from '../Point';
import { FasterQuadTree, PointEx, ClusterEx } from './FasterQuadTree';


export class FasterAvgAlgorithm implements IAlgorithm {
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: FasterQuadTree;

    constructor(private initialLevels: number = 10) {
        this.quadTree = new FasterQuadTree(initialLevels);
    }

    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(new PointEx(point.x, point.y, point.tag));
        }
    }

    *getNearestPairs(): Generator<Pair> {
        do {
            for (let { point1, point2 } of this.quadTree.getNeighbours()) {
                let pair = new Pair(
                    point1,
                    point2,
                    () => { });
                yield pair
            }
        } while (this.quadTree.trim());
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.quadTree.getDendrograms();
    }

    getDendrogramsCount(): number {
        return this.quadTree.pointCount;
    }
}
